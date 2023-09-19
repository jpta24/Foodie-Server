//Test
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

const notifications = [];
const membershipData = [
	{
		trial: {
			name: 'Trial',
			price: {
				usd: 0,
				eur: 0,
			},
			comision: 1,
			maxProducts: 10000000,
			maxHighlighted: 10000000,
			monthlySales: 100000000000,
			ads: false,
			payment: ['zelle', 'cash', 'card', 'pp', 'pagoMovil', 'other'],
			rank: 0,
		},
		free: {
			name: 'Free',
			price: {
				usd: 0,
				eur: 0,
			},
			comision: 4,
			maxProducts: 10,
			maxHighlighted: 3,
			monthlySales: 500,
			ads: true,
			payment: ['zelle', 'cash', 'pagoMovil', 'other'],
			rank: 4,
		},
		basic: {
			name: 'Basic',
			price: {
				usd: 3,
				eur: 3,
			},
			comision: 2,
			maxProducts: 50,
			maxHighlighted: 10,
			monthlySales: 2000,
			ads: false,
			payment: ['zelle', 'cash', 'card', 'pp', 'pagoMovil', 'other'],
			rank: 3,
		},
		premium: {
			name: 'Premium',
			price: {
				usd: 5,
				eur: 5,
			},
			comision: 1,
			maxProducts: 10000000,
			maxHighlighted: 10000000,
			monthlySales: 100000000000,
			ads: false,
			payment: ['zelle', 'cash', 'card', 'pp', 'pagoMovil', 'other'],
			rank: 1,
		},
		menu: {
			name: 'Menu',
			price: {
				usd: 5,
				eur: 5,
			},
			comision: 0,
			maxProducts: 10000000,
			maxHighlighted: 10000000,
			monthlySales: 10000000,
			ads: false,
			payment: [],
			rank: 0,
		},
		web: {
			name: 'MyWeb',
			price: {
				usd: 85,
				eur: 80,
			},
			rank: 2,
		},
		demo: {
			name: 'Demo',
			price: {
				usd: 0,
				eur: 0,
			},
			comision: 0,
			maxProducts: 10000000,
			maxHighlighted: 10000000,
			monthlySales: 100000000000,
			ads: false,
			payment: ['zelle', 'cash', 'card', 'pp', 'pagoMovil', 'other'],
		},
		rank: 0,
	},
];
const currency = '$';
const preMembership = 'trial';
const createNewMembership = (business, plan, currency) => {
	if (business && plan == 'trial') {
		business.usedTrial = true;
	}
	const activeMembership = business
		? business.membership.filter(
				(membership) => membership.status === 'active'
		  )[0]
		: null;
	const applyNow =
		!business || activeMembership.plan.rank > membershipData[0][plan].rank;

	const date = new Date();
	const nextDate = new Date();
	const dateNextPayment = new Date(
		nextDate.setMonth(nextDate.getMonth() + 1)
	);
	return {
		plan: {
			name: membershipData[0][plan].name,
			price: membershipData[0][plan].price,
			comision: membershipData[0][plan].comision,
			maxProducts: membershipData[0][plan].maxProducts,
			maxHighlighted: membershipData[0][plan].maxHighlighted,
			monthlySales: membershipData[0][plan].monthlySales,
			ads: membershipData[0][plan].ads,
			payment: membershipData[0][plan].payment,
		},
		updated: date,
		dateStart: applyNow ? date : null,
		dateNextPayment: !business
			? dateNextPayment
			: !applyNow
			? null
			: activeMembership.dateNextPayment,

		price: membershipData[0][plan].price[
			currency === '€' ||
			currency === 'euro' ||
			currency === 'EUR' ||
			currency === 'eur'
				? 'eur'
				: 'usd'
		],
		currency:
			currency === '€' ||
			currency === 'euro' ||
			currency === 'EUR' ||
			currency === 'eur'
				? 'eur'
				: 'usd',
		status: applyNow ? 'active' : 'nextMonth',
	};
};
const createNewMembershipConcept = async (business, membership, concept) => {
	const nextMonth =
		membership.status === 'nextMonth'
			? null
			: months[
					membership.dateNextPayment.getMonth() === 11
						? 0
						: membership.dateNextPayment.getMonth() + 1
			  ];
	const newConceptMembership = {
		_id: concept,
		business: business._id,
		code: 'membership',
		concept: `Membership`,
		description: `Monthly Membership Fee for your ${membership.plan.name} Plan for ${nextMonth}`,
		price: `${membership.price}`,
		status: 'notCreated',
		dateForPayment: membership.dateNextPayment,
	};

	arrConcepts.push(newConceptMembership);

	business.concepts.push(newConceptMembership);
};
const createNewComisionsConcept = async (business, concept) => {
	const activeMembership = business.membership.filter(
		(membership) => membership.status === 'active'
	)[0];
	const prevMonth =
		months[
			activeMembership.dateNextPayment.getMonth() === 0
				? 11
				: activeMembership.dateNextPayment.getMonth() - 1
		];
	const month = months[activeMembership.dateNextPayment.getMonth()];

	const newConceptComision = {
		_id: concept,
		business: business._id,
		code: 'comision',
		concept: `Sales Comision`,
		description: `Monthly Sales Comision Fees for ${prevMonth} - ${month}`,
		orders: { payed: [], notPayed: [] },
		price: 0,
		status: 'notCreated',
		dateForPayment: activeMembership.dateNextPayment,
	};

	arrConcepts.push(newConceptComision);

	business.concepts.push(newConceptComision);
};
const membership = [
	{
		plan: {
			name: 'Trial',
			price: [Object],
			comision: 1,
			maxProducts: 10000000,
			maxHighlighted: 10000000,
			monthlySales: 100000000000,
			ads: false,
			payment: [Object],
		},
		updated: new Date(
			'Mon Sep 18 2023 16:19:55 GMT+0200 (hora de verano de Europa central)'
		),
		dateStart: new Date(
			'Mon Sep 18 2023 16:19:55 GMT+0200 (hora de verano de Europa central)'
		),
		dateNextPayment: new Date(
			'Wed Oct 18 2023 16:19:55 GMT+0200 (hora de verano de Europa central)'
		),
		price: 0,
		currency: 'usd',
		status: 'active',
	},
];
const arrConcepts = [];

let business = {
	_id: 'zxcvbnm',
	name: 'myStore',
	membership,
	concepts: [],
	isActive: true,
	invoiceNotified: false,
	usedTrial: preMembership == 'trial',
};
createNewComisionsConcept(business, 'conceptCom1');
createNewMembershipConcept(business, membership[0], 'conceptMemTrial');

//* Se crea la tienda con el plan
// const newMemb = createNewMembership(null,'trial',currency)
const remainDays = 3;

//* CAMBIOS DE PLAN
const changePlan = (plan) => {
	const activeMembership = business.membership.filter(
		(membership) => membership.status === 'active'
	)[0];
	const applyNow = activeMembership.plan.rank > membershipData[0][plan].rank;

	const isNextPlan = business.membership.filter(
		(membership) => membership.status === 'nextMonth'
	)[0];

	if (isNextPlan) {
		business.membership = business.membership.filter(
			(membership) => membership.status !== 'nextMonth'
		);
	}

	business.concepts = business.concepts.filter(
		(concept) =>
			concept.code !== 'membership' || concept.status !== 'notCreated'
	);

	const newMembership = createNewMembership(
		business,
		plan,
		business.currency
	);

	business.membership.push(newMembership);

	createNewMembershipConcept(business, newMembership, `conceptMem${plan}`);

	if (applyNow) {
		activeMembership.status = 'changed';
		activeMembership.updated = new Date();
		// Send email
		notifications.push('Foodys Membership Updated');
	} else {
		// Send email

		notifications.push('Foodys Membership will Update');
	}

	if (plan == 'trial') {
		business.usedTrial = true;
	}
};
changePlan('premium');

//*Notifications
//*<5
const notify5d = (remainDays) => {
	const activeMembership = business.membership.filter(
		(membership) => membership.status === 'active'
	)[0];

	const isTrial = activeMembership.plan.name === 'Trial';
	const isNextPlan = business.membership.find(
		(membership) => membership.status === 'nextMonth'
	)
		? true
		: false;

	const changeMembership = business.membership.filter(
		(membership) => membership.status === 'nextMonth'
	)[0];

	const pendingConcepts = business.concepts.filter((concept) => {
		return concept.status === 'pending' || concept.status === 'notCreated';
	});
	const mustPay =
		pendingConcepts.filter((concept) => {
			return concept.price > 0;
		}).length > 0;

	//* VERIFY 5 DAYS BEFORE

	if (remainDays <= 5 && !business.invoiceNotified) {
		// console.log('here');
		if (isTrial && !isNextPlan) {
			// console.log('isTrial && no hay NextPlan');
			const newMembership = createNewMembership(
				business,
				'free',
				business.currency
			);
			business.concepts = business.concepts.filter(
				(concept) =>
					concept.code !== 'membership' &&
					concept.status !== 'notCreated'
			);
			business.membership.push(newMembership);
			createNewMembershipConcept(
				business,
				newMembership,
				'newConcetMemForTrial'
			);
			// Send email
			notifications.push('Trial will Expire');
		}

		if (mustPay) {
			// console.log('mustPAy');
			pendingConcepts.forEach(async (concept) => {
				concept.status = 'pending';
				if (concept.code === 'membership') {
					const month =
						months[activeMembership.dateNextPayment.getMonth()];

					concept.dateForPayment = activeMembership.dateNextPayment;
					concept.description = `Monthly Membership Fee for your ${activeMembership.plan.name} Plan for ${month}`;
				}
			});

			business.invoiceNotified = true;

			// Send email
			notifications.push('mailNewInvoice - must Pay');
		} else {
			notifications.push('check and no Pay required');
		}
	}
};
notify5d(remainDays);

//*DAY O CHANGE MEMBERSHIP
const day0 = (remainDays) => {
	const activeMembership = business.membership.filter(
		(membership) => membership.status === 'active'
	)[0];

	const isTrial = activeMembership.plan.name === 'Trial';
	const isNextPlan = business.membership.find(
		(membership) => membership.status === 'nextMonth'
	)
		? true
		: false;

	const changeMembership = business.membership.filter(
		(membership) => membership.status === 'nextMonth'
	)[0];

	const pendingConcepts = business.concepts.filter((concept) => {
		return concept.status === 'pending' || concept.status === 'notCreated';
	});
	const mustPay =
		pendingConcepts.filter((concept) => {
			return concept.price > 0;
		}).length > 0;
	//* VERIFY MEMBERSHIP CHANGES
	if (remainDays === 0 && changeMembership) {
		activeMembership.status = 'changed';
		activeMembership.dateChanged = new Date();

		changeMembership.status = 'active';
		changeMembership.dateStart = new Date();

		const nextPaymentDate = new Date(activeMembership.dateNextPayment);
		nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
		changeMembership.dateNextPayment = nextPaymentDate;

		// Send email
		notifications.push('Foodys Membership Updated');
	} else {
		notifications.push('No action on day 0');
	}
};
// day0(0)

//* CHECK PAYMENT
const checkPayment = (remainDays) => {
	const activeMembership = business.membership.filter(
		(membership) => membership.status === 'active'
	)[0];

	const isTrial = activeMembership.plan.name === 'Trial';
	const isNextPlan = business.membership.find(
		(membership) => membership.status === 'nextMonth'
	)
		? true
		: false;

	const changeMembership = business.membership.filter(
		(membership) => membership.status === 'nextMonth'
	)[0];

	const pendingConcepts = business.concepts.filter((concept) => {
		return concept.status === 'pending' || concept.status === 'notCreated';
	});
	const mustPay =
		pendingConcepts.filter((concept) => {
			return concept.price > 0;
		}).length > 0;
	if (
		remainDays === 0 &&
		business.isActive
		// && false
	) {
		if (!mustPay) {
			pendingConcepts.forEach(async (concept) => {
				concept.status = 'confirmed';
			});
			const nextPaymentDate = new Date(activeMembership.dateNextPayment);
			nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

			business.membership.dateForPayment = nextPaymentDate;
			createNewComisionsConcept(business, 'conceptComNewMonth');
			createNewMembershipConcept(
				business,
				activeMembership,
				'conceptComNewMonth'
			);
		} else {
			business.isActive = false;

			// Send email
			notifications.push('accoutInactive');
		}
	}
};
checkPayment(0);

// arrConcepts
business;
notifications;

// const enUso = business.invoiceNotified
// enUso
