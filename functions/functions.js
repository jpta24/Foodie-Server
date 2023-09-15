const sendMail = require('../config/nodemailer.config');
const membershipData = require('../data/memberships.json')

const {
	newBusiness,
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
		console.log(`Checking Memberships Activated at: ${new Date()}`);
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
			if (mustPay) {
				pendingConcepts.forEach(async (concept) => {
					concept.status = 'pending';
					await concept.save();
				});

				business.invoiceNotified = true;

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
		//* VERIFY MEMBERSHIP CHANGES
		if (activeMembership.dateNextPayment < currentDate && changeMembership.length > 0) {
			activeMembership.status = 'changed'
			activeMembership.dateChanged = new Date

			changeMembership.status = 'active'
			changeMembership.dateStart = new Date

			// Send email
			const mailOptions = {
				from: 'FOODYS APP <info@foodys.app>',
				to: business.address.email,
				subject: 'Foodys Membership Update',
				html: notificationMembershipChanged(business),
			};

			await sendMail(mailOptions);
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
				await createNewMembershipConcept(business);

			} else {
				business.isActive = false;

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

		await business.save();
		
	});
};

const createNewMembershipConcept = async (business) => {
	const activeMembership = business.membership.filter(
		(membership) => membership.status === 'active'
	)[0];
	const nextMonth =
		months[
			activeMembership.dateNextPayment.getMonth() === 11
				? 0
				: activeMembership.dateNextPayment.getMonth() + 1
		];
	const newConceptMembership = {
		business: business._id,
		code: 'membership',
		concept: `Membership`,
		description: `Monthly Membership Fee for your ${activeMembership.plan.name} Plan for ${nextMonth}`,
		price: `${activeMembership.price[activeMembership.currency]}`,
		status: 'notCreated',
		dateForPayment: business.membership[0].dateNextPayment,
	};

	const newConceptMembershipCreated = await Concept.create(
		newConceptMembership
	);

	business.concepts.push(newConceptMembershipCreated);
};

const createNewComisionsConcept = async (business) => {
	const activeMembership = business.membership.filter(
		(membership) => membership.status === 'active'
	)[0];
	const month = months[activeMembership.dateNextPayment.getMonth()];

	const newConceptComision = {
		business: business._id,
		code: 'comision',
		concept: `Sales Comision`,
		description: `Monthly Sales Comision Fees for ${month}`,
		orders: { payed: [], notPayed: [] },
		price: 0,
		status: 'notCreated',
		dateForPayment: activeMembership.dateNextPayment,
	};

	const newConceptComisionCreated = await Concept.create(newConceptComision);

	business.concepts.push(newConceptComisionCreated);
};

const createNewMembership =(business,plan,currency,status,nextMem)=>{
	const activeMembership = business ? business.membership.filter(
		(membership) => membership.status === 'active'
	)[0]:null;
	const date = new Date();

    const startDate = new Date()
	const dateStart = new Date(startDate.setMonth(startDate.getMonth() + (nextMem?1:0)));
    
    const nextDate = new Date()
	const dateNextPayment = new Date(nextDate.setMonth(nextDate.getMonth() + (activeMembership || nextMem ?2:1)));
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
		},
		updated: date,
		dateStart:  dateStart,
		dateNextPayment: dateNextPayment,
		price: membershipData[0][plan].price[
			currency === '€' || currency ==='euro' || currency ==='EUR' || currency ==='eur' ? 'eur' : 'usd'
		],
		currency:
			currency === '€' || currency ==='euro' || currency ==='EUR' || currency ==='eur' ? 'eur' : 'usd',
		status: status,
	}
}

module.exports = {
	checking,
	createNewComisionsConcept,
	createNewMembershipConcept,
	createNewMembership
};
