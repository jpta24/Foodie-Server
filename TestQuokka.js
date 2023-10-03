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
const memberships = [];
const arrConcepts = [];
const arrPayments = []
const arrInvoices = []
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

let business = {
	_id: 'zxcvbnm',
	name: 'myStore',
	membership:[],
	concepts: [],
	isActive: true,
	invoiceNotified: false,
	usedTrial: preMembership == 'trial',
    invoices:[],
    payments:[]
};

//* FUNCIONES

    const createNewMembership = (business, plan, currency,dateFake) => {
        
        const activeMembership = business
            ? business.membership.find(
                    (membership) => membership.status === 'active'
            )
            : null;

        const applyNow =
            !business 
            || activeMembership.plan.rank > 
            membershipData[0][plan].rank;

        const date = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();
        // const date = new Date()

        const isPrePayment = business && Math.floor(
			(activeMembership.dateNextPayment - date) /
				(1000 * 60 * 60 * 24) 
		)< 5
        

        const nextDate = new Date();
        const dateNextPayment = new Date(
            nextDate.setMonth(nextDate.getMonth() + 1)
        );
        const nextNextDate = new Date()
        const dateNextNextPayment = new Date(
            nextNextDate.setMonth(nextNextDate.getMonth() + 2)
        );


        return {
            plan: membershipData[0][plan],
            updated: date,
            dateStart: applyNow ? date : null,
            dateNextPayment: isPrePayment
                ? dateNextNextPayment
                : dateNextPayment,

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
            status: applyNow ? 'active' : isPrePayment ? 'nextMonthPayed':'nextMonth',
        };
    };
    const createNewMembershipConcept =(business, membership,status,isNextMonth, concept) => {

        const copyDateNextPayment = new Date (membership.dateNextPayment)

        const dateNextPaymentConcept =isNextMonth ?new Date(copyDateNextPayment.setMonth(copyDateNextPayment.getMonth() + 1)): membership.dateNextPayment
        // console.log(dateNextPaymentConcept);
        
        const nextMonth =months[
                    dateNextPaymentConcept.getMonth()];

        return {
            _id: concept,
            business: business._id,
            code: 'membership',
            concept: `Membership`,
            description: `Monthly Membership Fee for your ${membership.plan.name} Plan for ${nextMonth}`,
            price: `${membership.price}`,
            status: status,
            dateForPayment: dateNextPaymentConcept,
        };

        // arrConcepts.push(newConceptMembership);

        // business.concepts.push(newConceptMembership);
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
// createNewMembership(null,'trial',business.currency)
// createNewComisionsConcept(business, 'conceptCom1');
// createNewMembershipConcept(business, business.membership[0],false, 'conceptMemTrial');

//* Se crea la tienda con el plan
    const createBusWithPlan= async (business,prePlan)=>{
        if (prePlan==='trial') {
                    business.usedTrial = true
                }

        // ! Borrar codigo de abajo y descomentar el de mas abajo
        const newMembership = createNewMembership(null,prePlan,currency)
        
        business.membership.push(newMembership)

        // ! Borrar codigo de arriba y descomentar el de abajo
        // const newMembership = Membership.create(createNewMembership(null,preMembership,currency))

        // business.membership.push(newMembership._id)
        
        // business.save()
    }


    //* CAMBIOS DE PLAN
    const changePlan = async (business,plan,dateFake) => {
        const activeMembership = business.membership.find(
            (membership) => membership.status === 'active'
        );
        const applyNow = activeMembership.plan.rank > membershipData[0][plan].rank;
        
        const date = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();
        // const date = new Date()

        const isPrePayment = business && Math.floor(
			(activeMembership.dateNextPayment - date) /
				(1000 * 60 * 60 * 24) 
		)< 5

        business.membership = business.membership.filter(
            (membership) => membership.status !== 'nextMonth'
        );

        // ! Borrar codigo de abajo y descomentar el de mas abajo

        const newMembership = createNewMembership(
            business,
            plan,
            business.currency, dateFake
        );

        business.membership.push(newMembership);

        // ! Borrar codigo de abajo y descomentar el de mas abajo
        
        // const newMembership = await Membership.create(createNewMembership(
        //     business,
        //     plan,
        //     business.currency, dateFake
        // ));

        // business.membership.push(newMembership._id);

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

        //await business.save()
        //await activeMembership.save()
    };

    //*Notifications
    //*<5
    const notify5d = async (dateFake=0) => {
        const activeMembership = business.membership.find(
            (membership) => membership.status === 'active'
        );
        const nextPlan = business.membership.find(
            (membership) => membership.status === 'nextMonth' 
        )

        const nextPlanPayed = business.membership.find(membership => membership.status ==='nextMonthPayed')

        const isTrial = activeMembership.plan.name === 'Trial';

        const useMembership = nextPlan || activeMembership

        const currentDate = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();

        // const currentDate = new Date()

        const remainDays = Math.floor(
			(activeMembership.dateNextPayment - currentDate) /
				(1000 * 60 * 60 * 24)
		);
                
        //* VERIFY 5 DAYS BEFORE

        if (remainDays <= 5 && !business.invoiceNotified) {

            if(!nextPlanPayed && nextPlan?.plan.name !== 'Free' && activeMembership.plan.name !== 'Trial' ){
                console.log(nextPlanPayed);
                // ! Borrar codigo de abajo y descomentar el de mas abajo

                const newMembConcept = createNewMembershipConcept(business,useMembership,'pending',false,'mem5d')
            
                business.concepts.push(newMembConcept)
                // ! Borrar codigo de arriba y descomentar el de abajo
                // const newMembConcept = await Concept.create((createNewMembershipConcept(business,useMembership,'pending',false,'mem5d'))

                // business.concepts.push(newMembConcept._id)
                // business.save()    
            }

            
            

            if (isTrial && (!nextPlan && !nextPlanPayed)) {

            // ! Borrar codigo de abajo y descomentar el de mas abajo
            const newMembership = createNewMembership(
                    business,
                    'free',
                    business.currency,30
                )
        
            business.membership.push(newMembership)

            // ! Borrar codigo de arriba y descomentar el de abajo
            // const newMembership = Membership.create      (createNewMembership(
                        // business,
                        // 'free',
                        // business.currency,30
                    // )

            // business.membership.push(newMembership._id)
                // Send email
                notifications.push('Trial will Expire');
            }

            const pendingConcepts = business.concepts.filter((concept) => concept.status === 'pending');

            const mustPay =
            pendingConcepts.filter((concept) => {
                return concept.price > 0;
            }).length > 0;

            if (mustPay) {


                business.invoiceNotified = true;

                // Send email
                notifications.push('mailNewInvoice - must Pay');
            } else {
                notifications.push('check and no Pay required');
            }
        }
    };

    //*PAYMENT
    const makePayment =(number,business)=>{
        const newInvoice = {
            _id:`invoice${number}`,
            business:business._id,
            payment:null,
            // concepts:[business.concepts[1]],
            concepts:business.concepts,
            status:'payed'
        }
        //const createdInvoice = await newInvoice.create(newInvoice)
        const newPayment = {
            _id:`payment${number}`,
            business:business._id
            
        }

        // const createdPayment = await Payment.create(newPayment)
        // createdInvoice.payment = createdPayment._id
        // createdInvoice.concepts.forEach(concept => {
        //     concept.status = createdInvoice.status
        //     concept.invoice = createdInvoice._id
        // }); 
        // business.invoices.push(createdInvoice._id);
        // business.payments.push(createPayment._id)
        //await createdInvoice.save()
        //await business.save()

        
        
        newInvoice.payment = newPayment._id
        newInvoice.concepts.forEach(concept => {
            concept.status = newInvoice.status
            concept.invoice = newInvoice._id
        }); 

        business.invoices.push(newInvoice._id);
        business.payments.push(newPayment._id)
        notifications.push('Payment Received');
    }

    //* CHECK PAYMENT
    const checkPayment = (dateFake=0) => {
        const activeMembership = business.membership.find(
            (membership) => membership.status === 'active'
        );

        const isTrial = activeMembership.plan.name === 'Trial';

        const nextPlan = business.membership.find(
            (membership) => membership.status === 'nextMonth'
        )

        const pendingConcepts = business.concepts.filter((concept) => {
            return concept.status === 'pending';
        });
        const currentDate = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();

        // const currentDate = new Date()

        const remainDays = Math.floor(
			(activeMembership.dateNextPayment - currentDate) /
				(1000 * 60 * 60 * 24)
		);

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
                //await concept.save()
                });
                    business.invoiceNotified=false
                    notifications.push('no Payment Required');
            } else {
                business.isActive = false;

                // Send email
                notifications.push('accoutInactive');
            }
            //await business.isActive()
        }
    };

    //*DAY O CHANGE MEMBERSHIP
    const changeMembership = (dateFake=0) => {
        const activeMembership = business.membership.find(
            (membership) => membership.status === 'active'
        );

        const isTrial = activeMembership.plan.name === 'Trial';
        
        const changeMembership = business.membership.find(
            (membership) => membership.status === 'nextMonth' || membership.status === 'nextMonthPayed'
        );

        const pendingConcepts = business.concepts.filter((concept) => {
            return concept.status === 'pending' || concept.status === 'notCreated';
        });
        const mustPay =
            pendingConcepts.filter((concept) => {
                return concept.price > 0;
            }).length > 0;

        const currentDate = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();

        // const currentDate = new Date()

        const remainDays = Math.floor(
            (activeMembership.dateNextPayment - currentDate) /
                (1000 * 60 * 60 * 24)
        );

        //* VERIFY MEMBERSHIP CHANGES
        const isDue = business.concepts.filter((concept) => concept.status === 'pending' 
            ).length === 0;

        if (remainDays === 0 && changeMembership && isDue) {
            activeMembership.status = 'changed';
            activeMembership.updated = new Date();

            changeMembership.status = 'active';
            changeMembership.dateStart = new Date();

            const nextPaymentDate = new Date(activeMembership.dateNextPayment);

            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            changeMembership.dateNextPayment = nextPaymentDate;
            
            //await activeMembership.save()
            //await changeMembership.save()

            // Send email
            notifications.push('Foodys Membership Updated');
        } else {
            notifications.push('No action on day 0');
        }
    };


//!APLICACION DE FUNCIONES
createBusWithPlan(business,'trial')
// changePlan(business,'free',10);
notify5d(26);
// makePayment(1,business)
// checkPayment(30);
// changeMembership(30)

// changePlan(business,'free',10);
// makePayment(1,business)
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
const memberships = [];
const arrConcepts = [];
const arrPayments = []
const arrInvoices = []
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

let business = {
	_id: 'zxcvbnm',
	name: 'myStore',
	membership:[],
	concepts: [],
	isActive: true,
	invoiceNotified: false,
	usedTrial: false,
    invoices:[],
    payments:[]
};

//* FUNCIONES

    const createNewMembership = (business, plan, currency,dateFake) => {
        
        const activeMembership = business
            ? business.membership.find(
                    (membership) => membership.status === 'active'
            )
            : null;

        const applyNow =
            !business 
            || plan==='menu' || activeMembership.plan.rank > 
            membershipData[0][plan].rank;


        const date = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();
        // const date = new Date()

        const isPrePayment = business &&   Math.floor(
			(activeMembership.dateNextPayment - date) /
				(1000 * 60 * 60 * 24) 
		)< 5

        const nextDate = new Date();
        const dateNextPayment = new Date(
            nextDate.setMonth(nextDate.getMonth() + 1)
        );
        const nextNextDate = new Date()
        const dateNextNextPayment = new Date(
            nextNextDate.setMonth(nextNextDate.getMonth() + 2)
        );


        return {
            plan: membershipData[0][plan],
            updated: date,
            dateStart: applyNow ? date : null,
            // trial => premium  <5d necesito este
            dateNextPayment: isPrePayment
                ? dateNextNextPayment
                : dateNextPayment,

            // dateNextPayment: (isPrePayment || !applyNow) ? dateNextNextPayment: dateNextPayment,

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
            status: applyNow ? 'active' : plan === 'free' || !isPrePayment ? 'nextMonth' : 'nextMonthPayed',
        };
    };
    const createNewMembershipConcept =(business, membership,status,isNextMonth, concept) => {

        const copyDateNextPayment = new Date (membership.dateNextPayment)

        // const dateNextPaymentConcept =!isNextMonth ? new Date(copyDateNextPayment.setMonth(copyDateNextPayment.getMonth() -1)): membership.dateNextPayment
        const dateNextPaymentConcept = membership.dateNextPayment
        
        //este codigo se necesita para trial => premium <5d
        const thisMonth =months[
            membership.dateNextPayment.getMonth()];
        
        const nextMonth =months[membership.dateNextPayment.getMonth()===11?0:
            membership.dateNextPayment.getMonth()+ 1];
            console.log(membership.dateNextPayment.getMonth());

        // const thisMonth =months[
        //     membership.dateNextPayment.getMonth()+ (membership.status === 'active'? 0:-1)];
        
        // const nextMonth =months[
        //     membership.dateNextPayment.getMonth()+ (membership.status === 'active'? 1:0)];

        return {
            _id: concept,
            business: business._id,
            code: 'membership',
            concept: `Membership`,
            description: `Monthly Membership Fee for your ${membership.plan.name} Plan for ${thisMonth} - ${nextMonth}`,
            price: `${membership.price}`,
            status: status,
            dateForPayment: dateNextPaymentConcept,
            datePayed:null
        };

        // arrConcepts.push(newConceptMembership);

        // business.concepts.push(newConceptMembership);
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
// createNewMembership(null,'trial',business.currency)
// createNewComisionsConcept(business, 'conceptCom1');
// createNewMembershipConcept(business, business.membership[0],false, 'conceptMemTrial');

//* Se crea la tienda con el plan
    const createBusWithPlan= async (business,prePlan)=>{
        if (prePlan==='trial') {
                    business.usedTrial = true
                }

        // ! Borrar codigo de abajo y descomentar el de mas abajo
        const newMembership = createNewMembership(null,prePlan,currency)
        
        business.membership.push(newMembership)

        // ! Borrar codigo de arriba y descomentar el de abajo
        // const newMembership = Membership.create(createNewMembership(null,preMembership,currency))

        // business.membership.push(newMembership._id)
        
        // business.save()
    }


    //* CAMBIOS DE PLAN
    const changePlan = async (business,plan,dateFake) => {
        const activeMembership = business.membership.find(
            (membership) => membership.status === 'active'
        );
        const applyNow = plan === 'menu' || activeMembership.plan.rank > membershipData[0][plan].rank ;
        
        const date = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();
        // const date = new Date()

        business.membership = business.membership.filter(
            (membership) => membership.status !== 'nextMonth'
        );

        // ! Borrar codigo de abajo y descomentar el de mas abajo

        const newMembership = createNewMembership(
            business,
            plan,
            business.currency, dateFake
        );
        business.isActive = true
        business.membership.push(newMembership);

        // ! Borrar codigo de abajo y descomentar el de mas abajo
        
        // const newMembership = await Membership.create(createNewMembership(
        //     business,
        //     plan,
        //     business.currency, dateFake
        // ));
        //business.isActive = true

        // business.membership.push(newMembership._id);

        if (applyNow) {
            if (plan==='trial') {
                const dateActiveMembership = new Date(activeMembership.dateNextPayment)
                dateActiveMembership.setMonth(dateActiveMembership.getMonth()+1)
                const dateTrial = new Date(date.setMonth(date.getMonth()+1))
                
                newMembership.dateNextPayment = dateTrial
                newMembership.updated = date;

                // activeMembership.status = 'nextMonthPayed'

                //! lo necesito para basic => trial notify(55)
                activeMembership.status = 'nextMonth'
                activeMembership.dateNextPayment = dateActiveMembership
                activeMembership.updated = date;

                //! necesario para borrar pendientes en 
                //! basic => trial >5d
                business.concepts = business.concepts.filter(memb => memb.code !=='membership' || memb.status !== 'pending')
                business.invoiceNotified= false


            }else{
                activeMembership.status = 'changed';
                activeMembership.updated = date;

                // Send email
                notifications.push('Foodys Membership Updated');
            }
            
        } else {
            // Send email

            notifications.push('Foodys Membership will Update');
        }

        if (plan == 'trial') {
            business.usedTrial = true;
        }

        //await business.save()
        //await activeMembership.save()
        //await newMembership.save()
    };

    //*Notifications
    //*<5
    const notify5d = async (dateFake=0) => {
        const activeMembership = business.membership.find(
            (membership) => membership.status === 'active'
        );
        let nextPlan = business.membership.find(
            (membership) => membership.status === 'nextMonth' 
        )

        const nextPlanPayed = business.membership.find(membership => membership.status ==='nextMonthPayed')

        const isTrial = activeMembership.plan.name === 'Trial';

        const useMembership = nextPlan || activeMembership

        const currentDate = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();

        // const currentDate = new Date()

        const remainDays = Math.floor(
			(activeMembership.dateNextPayment - currentDate) /
				(1000 * 60 * 60 * 24)
		);
                
        //* VERIFY 5 DAYS BEFORE

        if (remainDays <= 5 && !business.invoiceNotified) {
            let sendTrial = false
            if (isTrial && !nextPlan && !nextPlanPayed ) {

            // ! Borrar codigo de abajo y descomentar el de mas abajo
            const newMembership = createNewMembership(
                    business,
                    'free',
                    business.currency,30
                )
            nextPlan = newMembership
        
            business.membership.push(newMembership)

            // ! Borrar codigo de arriba y descomentar el de abajo
            // const newMembership = Membership.create      (createNewMembership(
                        // business,
                        // 'free',
                        // business.currency,30
                    // )

            // business.membership.push(newMembership._id)
                // Send email
                notifications.push('Trial will Expire');
                sendTrial=true
            }

            if(isTrial && (nextPlan?.plan.name ==='Free'|| nextPlanPayed?.plan.name === 'Free') && !sendTrial){
                // Send email
                notifications.push('Trial will Expire');
            }

            if(!nextPlanPayed && nextPlan?.plan.name !== 'Free' && activeMembership.plan.name!=='Free'){
                
                // ! Borrar codigo de abajo y descomentar el de mas abajo

                const newMembConcept = createNewMembershipConcept(business,useMembership,'pending',false,'mem5d')
            
                business.concepts.push(newMembConcept)
                // ! Borrar codigo de arriba y descomentar el de abajo
                // const newMembConcept = await Concept.create((createNewMembershipConcept(business,useMembership,'pending',false,'mem5d'))

                // business.concepts.push(newMembConcept._id)
                // business.save()    
            }

            const pendingConcepts = business.concepts.filter((concept) => concept.status === 'pending');

            const mustPay =
            pendingConcepts.filter((concept) => {
                return concept.price > 0;
            }).length > 0;

            if (mustPay) {
                business.invoiceNotified = true;

                // Send email
                notifications.push('mailNewInvoice - must Pay');
            } else {
                notifications.push('check and no Pay required');
            }
        }
    };

    //*PAYMENT
    const makePayment =(number,business)=>{
        const newInvoice = {
            _id:`invoice${number}`,
            business:business._id,
            payment:null,
            // concepts:[business.concepts[1]],
            concepts:business.concepts,
            status:'payed'
        }
        //const createdInvoice = await newInvoice.create(newInvoice)
        const newPayment = {
            _id:`payment${number}`,
            business:business._id
            
        }

        // const createdPayment = await Payment.create(newPayment)
        // createdInvoice.payment = createdPayment._id
        // createdInvoice.concepts.forEach(concept => {
        //     concept.status = createdInvoice.status
        //     concept.invoice = createdInvoice._id
        // }); 
        // business.invoices.push(createdInvoice._id);
        // business.payments.push(createPayment._id)
        //await createdInvoice.save()
        //await business.save()

        
        
        newInvoice.payment = newPayment._id
        newInvoice.concepts.forEach(concept => {
            concept.status = newInvoice.status
            concept.invoice = newInvoice._id
        }); 

        business.invoices.push(newInvoice._id);
        business.payments.push(newPayment._id)
        notifications.push('Payment Received');
    }

    //* CHECK PAYMENT
    const checkPayment = (dateFake=0) => {
        const activeMembership = business.membership.find(
            (membership) => membership.status === 'active'
        );

        const isTrial = activeMembership.plan.name === 'Trial';

        const nextPlan = business.membership.find(
            (membership) => membership.status === 'nextMonth'
        )

        const pendingConcepts = business.concepts.filter((concept) => {
            return concept.status === 'pending';
        });
        const currentDate = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();

        // const currentDate = new Date()

        const remainDays = Math.floor(
			(activeMembership.dateNextPayment - currentDate) /
				(1000 * 60 * 60 * 24)
		);
        
        // remainDays

        const mustPay =
            pendingConcepts.filter((concept) => {
                return concept.price > 0;
            }).length > 0;

        if (
            remainDays <= 0 &&
            business.isActive
            // && false
        ) {
            if (!mustPay) {
                pendingConcepts.forEach(async (concept) => {
                    concept.status = 'confirmed';
                //await concept.save()
                });
                    business.invoiceNotified=false
                    notifications.push('no Payment Required');
            } else {
                business.isActive = false;

                // Send email
                notifications.push('accoutInactive');
            }
            //await business.isActive()
        }
    };

    //*DAY O CHANGE MEMBERSHIP
    const changeMembership = (dateFake=0) => {
        const activeMembership = business.membership.find(
            (membership) => membership.status === 'active'
        );

        const isTrial = activeMembership.plan.name === 'Trial';
        
        const changeMembership = business.membership.find(
            (membership) => membership.status === 'nextMonth' || membership.status === 'nextMonthPayed'
        );
        const pendingConcepts = business.concepts.filter((concept) => {
            return concept.status === 'pending' || concept.status === 'notCreated';
        });
        const mustPay =
            pendingConcepts.filter((concept) => {
                return concept.price > 0;
            }).length > 0;

        const currentDate = dateFake ? new Date(new Date().setDate(new Date().getDate()+dateFake)) : new Date();

        // const currentDate = new Date()

        const remainDays = Math.floor(
            (activeMembership.dateNextPayment - currentDate) /
                (1000 * 60 * 60 * 24)
        );

        //* VERIFY MEMBERSHIP CHANGES
        const isDue = business.concepts.filter((concept) => concept.status === 'pending' 
            ).length === 0;

        if (remainDays <= 0 && changeMembership && isDue) {
            //! Pendiente con este codigo por si no hace falta ya que todoas las memb deben venir con fecha nextpay
            //! Hace falta para trial => premium <5d
            
            if (changeMembership.status !== 'nextMonthPayed') {
                console.log(changeMembership.status);
                const nextPaymentDate = new Date(activeMembership.dateNextPayment);

                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                changeMembership.dateNextPayment = nextPaymentDate;    
            }
            
            //! Hasta aqui ---------

            activeMembership.status = 'changed';
            activeMembership.updated = currentDate;

            changeMembership.status = 'active';
            changeMembership.dateStart = currentDate;
            changeMembership.updated = currentDate;

            

            //await activeMembership.save()
            //await changeMembership.save()

            // Send email
            notifications.push('Foodys Membership Updated');

        } else if (remainDays <= 0 && !changeMembership && isDue) {

            const copyDateNextPayment = new Date(activeMembership.dateNextPayment)

            copyDateNextPayment.setMonth(copyDateNextPayment.getMonth()+1)
            
            activeMembership.dateNextPayment = copyDateNextPayment
            notifications.push('No action on day 0 - Plan extended');
        } else {
            notifications.push('No action on day 0');
        }
    };


//!APLICACION DE FUNCIONES
createBusWithPlan(business,'basic')
// changePlan(business,'trial',10);
notify5d(26);
// notify5d(36);
changePlan(business,'trial',27);
notify5d(55);
// makePayment(1,business)
// checkPayment(31);
// checkPayment(62);
// changeMembership(31)
// changeMembership(62)

// changePlan(business,'premium',31);
// makePayment(1,business)
// checkPayment(30);
// changeMembership(30)

// const planName = business.membership.find(membership=>membership.status==='active')?.plan.name
// const nextMonthName = business.membership.find(membership=>membership.status==='nextMonth')?.plan.name
// const nextMonthPayed = business.membership.find(membership=>membership.status==='nextMonthPayed')?.plan.name
// planName
// nextMonthName
// nextMonthPayed
// //! LOGS
// arrConcepts
business;
notifications;

// const enUso = business.membership[0]
// enUso
// changeMembership(30)


//! LOGS
// arrConcepts
business;
notifications;

// const enUso = business.membership[0]
// enUso
