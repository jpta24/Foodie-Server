const sendMail = require('../config/nodemailer.config');
const membershipData = require('../data/memberships.json')

const {
	accountInactiveInvoicePayment,
	notificationNewInvoice,
	notificationMembershipChanged
} = require('../data/mails');

const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');
const Invoice = require('../models/Invoice.model');
const Concept = require('../models/Concept.model');

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dic',
];
const checking = () => {
	const currentDate = new Date();
	const nextCheck = new Date();
	nextCheck.setHours(9, 0, 0, 0);

	let diff = nextCheck - currentDate;

	if (diff < 0) {
		nextCheck.setDate(nextCheck.getDate() + 1);
		diff = nextCheck - currentDate;
	}

	setTimeout(() => {
		console.log(`Checking Businesses Activated at: ${new Date()}`);
		setInterval(checkBusinesses, 24 * 60 * 60 * 1000);
	}, diff);
};

const checkBusinesses = async () => {
	const businesses = await Business.find()
		.populate('invoices concepts')
		.select('invoices concepts name membership isActive address');

	businesses.forEach(async (business) => {
		const activeMembership = business.membership.filter(
			(membership) => membership.status === 'active'
		)[0];

		const isTrial = activeMembership.plan.name ==='Trial'
		const isNextPlan = business.membership.find(membership=>membership.status==='nextMonth') ? true:false
		const nextPlan = isNextPlan ? business.membership.find(membership=>membership.status==='nextMonth') : null

		const changeMembership = business.membership.filter(membership=>membership.status==='nextMonth')[0]

		const pendingConcepts = business.concepts.filter((concept) => {
			return (
				concept.status === 'pending' || concept.status === 'notCreated'
			);
		});
		const mustPay =
			pendingConcepts.filter((concept) => {
				return concept.price > 0;
			}).length > 0;

		//* VERIFY 5 DAYS BEFORE

		const remainDays = Math.floor(
			(activeMembership.dateNextPayment - currentDate) /
				(1000 * 60 * 60 * 24)
		);

		if (remainDays <= 5 && !business.invoiceNotified) {
			if (isTrial && !isNextPlan) {
				const newMembership= createNewMembership(business,'free',business.currency)
				business.concepts = business.concepts.filter(concept=>concept.code!=='membership' || concept.status !=='notCreated')
				business.membership.push(newMembership)
				await createNewMembershipConcept(business,newMembership)
				
				await business.save();
				// Send email
				const mailOptions = {
					from: 'FOODYS APP <info@foodys.app>',
					to: business.address.email,
					subject: 'Your Foodys Free Trial is about to Expire',
					html: notificationNewInvoice(business),
				};

				await sendMail(mailOptions);
			}

			if (mustPay) {
				pendingConcepts.forEach(async (concept) => {
					concept.status = 'pending';
					
					await concept.save();
				});

				business.invoiceNotified = true;
				
				await business.save();

				// Send email
				const mailOptions = {
					from: 'FOODYS APP <info@foodys.app>',
					to: business.address.email,
					subject: 'New Foodys Invoice Generated - Action Required',
					html: notificationNewInvoice(business),
				};

				await sendMail(mailOptions);
			}
			
		}

		//* VERIFY PASS PAYMENT DATE
		if (
			activeMembership.dateNextPayment < currentDate &&
			business.isActive
			// && false
		) {
			if (!mustPay) {
				pendingConcepts.forEach(async (concept) => {
					concept.status = 'confirmed';
					await concept.save();
				});
				const nextPaymentDate = new Date(
					activeMembership.dateNextPayment
				);
				nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

				business.membership.dateForPayment = nextPaymentDate;
				await createNewComisionsConcept(business);
				await createNewMembershipConcept(business,isNextPlan?nextPlan:activeMembership);
				business.invoiceNotified=false
				
				await business.save();

			} else {
				business.isActive = false;
				
				await business.save();

				// Send email
				const mailOptions = {
					from: 'FOODYS APP <info@foodys.app>',
					to: business.address.email,
					subject: 'Foodys Account Status Update',
					html: accountInactiveInvoicePayment(
						business),
				};

				await sendMail(mailOptions);
			}
		}

		//* VERIFY MEMBERSHIP CHANGES
		const isDue = business.concepts.filter((concept) => concept.status === 'pending' 
		).length === 0;
		if (activeMembership.dateNextPayment < currentDate && changeMembership&&isDue) {
			activeMembership.status = 'changed'
			activeMembership.dateChanged = new Date

			changeMembership.status = 'active'
			changeMembership.dateStart = new Date
			const nextPaymentDate = new Date(
				activeMembership.dateNextPayment
			);
			nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
			changeMembership.dateNextPayment = nextPaymentDate
			applyMembershipChanges(business,changeMembership.plan.name.toLocaleLowerCase())
			
			await business.save();

			// Send email
			const mailOptions = {
				from: 'FOODYS APP <info@foodys.app>',
				to: business.address.email,
				subject: 'Foodys Membership Updated',
				html: notificationMembershipChanged(business),
			};

			await sendMail(mailOptions);
		}


		
		
	});
};

const createNewMembershipConcept = async (business,membership,isNextMonth) => {
	
	const nextMonth =months[
                membership.dateNextPayment.getMonth()];
	const newConceptMembership = {
		business: business._id,
		code: 'membership',
		concept: `Membership`,
		description: `Monthly Membership Fee for your ${membership.plan.name} Plan for ${nextMonth}`,
		price: `${membership.price}`,
		status: 'notCreated',
		dateForPayment: membership.dateNextPayment,
	};

	const newConceptMembershipCreated = await Concept.create(
		newConceptMembership
	);

	business.concepts.push(newConceptMembershipCreated);
};

const createNewComisionsConcept = async (business) => {
	const prevMonth = months[
        activeMembership.dateNextPayment.getMonth() === 0
            ? 11
            : activeMembership.dateNextPayment.getMonth() - 1
    ];
	const month = months[activeMembership.dateNextPayment.getMonth()];

	const newConceptComision = {
		business: business._id,
		code: 'comision',
		concept: `Sales Comision`,
		description: `Monthly Sales Comision Fees for ${prevMonth} - ${month}`,
		orders: { payed: [], notPayed: [] },
		price: 0,
		status: 'notCreated',
		dateForPayment: activeMembership.dateNextPayment,
	};

	const newConceptComisionCreated = await Concept.create(newConceptComision);

	business.concepts.push(newConceptComisionCreated);
};

const createNewMembership =(business,plan,currency)=>{
	if (business && plan=='trial') {
        business.usedTrial = true
    }
	const activeMembership = business ? business.membership.filter(
		(membership) => membership.status === 'active'
	)[0]:null;
	const applyNow = !business || activeMembership.plan.rank > membershipData[0][plan].rank

	const date = new Date();
    const nextDate = new Date()
	const dateNextPayment = new Date(nextDate.setMonth(nextDate.getMonth() + 1)); 
	
	return {
		plan: {
			name: membershipData[0][plan].name,
			price: membershipData[0][plan].price,
			comision:membershipData[0][plan].comision,
			maxProducts:membershipData[0][plan].maxProducts,
			maxHighlighted:membershipData[0][plan].maxHighlighted,
			monthlySales:membershipData[0][plan].monthlySales,
			ads:membershipData[0][plan].ads,
			payment:membershipData[0][plan].payment,
			rank:membershipData[0][plan].rank
		},
		updated: date,
		dateStart:  applyNow?date:null,
		dateNextPayment: !business
		? dateNextPayment
		: activeMembership.dateNextPayment,

		price: membershipData[0][plan].price[
			currency === '€' || currency ==='euro' || currency ==='EUR' || currency ==='eur' ? 'eur' : 'usd'
		],
		currency:
			currency === '€' || currency ==='euro' || currency ==='EUR' || currency ==='eur' ? 'eur' : 'usd',
		status: applyNow?'active':'nextMonth',
	}
}

const applyMembershipChanges =(business,plan)=>{
	const newPlan = membershipData[plan]
	if (business.products.length > newPlan.maxProducts) {
		business.products.forEach((product,i) =>{
			if (i>newPlan.maxProducts-1&&product.status==='active') {
				product.status='paused'
				product.save()
			}
		})
	}
	if (business.highlightedProducts.length > newPlan.maxHighlighted) {
		business.highlightedProducts = business.highlightedProducts.slice(0,newPlan.maxProducts)
	}
	business.save()
}

module.exports = {
	checking,
	createNewComisionsConcept,
	createNewMembershipConcept,
	createNewMembership
};
