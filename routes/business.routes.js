const router = require('express').Router();

const sendMail = require('../config/nodemailer.config');
const { newBusiness } = require('../data/mails');

const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');

const { isAuthenticated } = require('../middleware/jwt.middleware');

router.post('/', isAuthenticated, (req, res, next) => {
	const { buz } = req.body;

	const {
		name,
		address,
		categories,
		type,
		format,
		owner,
		currency,
		membership: preMembership,
	} = buz;

	// console.log({
	// 	name,
	// 	logoUrl,
	// 	address,
	// 	ssmm,
	// 	format,
	// 	type,
	// 	categories,
	// 	description,
	// 	bgUrl,
	// 	pdfMenu,
	// 	employees,
	// 	owner,
	// 	currency,
	// 	payment,
	// 	preMembership,
	// });

	if (
		format.delivery === false &&
		format.pickup === false &&
		format.inplace === false
	) {
		res
			.status(400)
			.json({ message: 'Please select at least one delivery format' });
		return;
	}

	if (
		type.prepared === false &&
		type.packed === false &&
		type.frozen === false
	) {
		res
			.status(400)
			.json({ message: 'Please select at least one Product Type' });
		return;
	}
	if (categories.length === 0) {
		res
			.status(400)
			.json({ message: 'Please select at least one Catalog Category' });
		return;
	}

	if (
		name === '' ||
		address.street === '' ||
		address.city === '' ||
		address.country === ''
	) {
		res.status(400).json({ message: 'Provide a correct Name and Address ' });
		return;
	}
	const membership = {
		plan: preMembership.plan,
		usedTrial: preMembership === 'trial' ? true : false,
		updated: new Date(),
	};
	// console.log({ membership });
	const newBuz = {
		name,
		address,
		categories,
		type,
		format,
		owner,
		currency,
		membership,
	};
	Business.findOne({ name })
		.then((foundBusiness) => {
			if (foundBusiness) {
				res.status(400).json({ message: 'Business already exists.' });
				return;
			}

			return Business.create(newBuz);
		})
		.then((business) => {
			User.findByIdAndUpdate(
				owner,
				{ business: business._id, rol: 'admin' },
				{ new: true }
			)
				.then((userUpdated) => {
					// Send email confirmation create a Business
					const mailOptions = {
						from: 'info@foodys.app',
						to: address.email,
						subject: 'You successfully created a Foodys Business account!',
						bcc: 'info@foodys.app',
						html: newBusiness(userUpdated, name),
					};

					sendMail(mailOptions);

					res.status(201).json({ business: business });
				})
				.catch((err) => {
					console.log(err);
					res
						.status(500)
						.json({ message: 'Could not Update the user Business' });
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'Could not create the Business, check data and try again',
			});
		});
});

router.get('/:businessNameEncoded', (req, res, next) => {
	const name = req.params.businessNameEncoded.split('-').join(' ');

	Business.findOne({ name })
		.populate('products')
		.populate('employees')
		.populate('orders')
		.populate({
			path: 'orders',
			populate: {
				path: 'business',
			},
		})
		.populate({
			path: 'orders',
			populate: {
				path: 'user',
			},
		})
		.populate({
			path: 'orders',
			populate: {
				path: 'products',
				populate: {
					path: 'product',
				},
			},
		})
		.then((business) => {
			if (business) {
				res.status(200).json({ business });
			} else {
				res.status(400).json({ message: 'Business does not exists.' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/edit/:businessNameEncoded', isAuthenticated, (req, res, next) => {
	const buzName = req.params.businessNameEncoded.split('-').join(' ');
	const { part, buz } = req.body;
	let editBuz;
	if (part === 1) {
		const { name, address, categories, type, format, owner, currency } = buz;
		editBuz = { name, address, categories, type, format, owner, currency };
	} else if (part === 2) {
		const { logoUrl, ssmm, description, bgUrl, pdfMenu, payment } = buz;
		editBuz = { logoUrl, ssmm, description, bgUrl, pdfMenu, payment };
	}

	Business.findOneAndUpdate({ name: buzName }, editBuz, { new: true })
		.then((business) => {
			res.status(200).json({ business });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.delete('/delete/:businessID', isAuthenticated, (req, res) => {
	const { businessID } = req.params;

	Business.findByIdAndRemove(businessID)
		.then((business) => {
			return User.findByIdAndUpdate(business.owner._id, {
				$unset: { business: '' },
			}).then((user) => {
				res.json({
					message: `Business with the id ${business._id} was successfully deleted and updated the user`,
				});
			});
		})
		.catch((err) => console.log(err));
});

router.get('/membership/:businessNameEncoded', (req, res, next) => {
	const buzName = req.params.businessNameEncoded.split('-').join(' ');

	Business.findOne({ name: buzName })
		.then((business) => {
			const { owner, membership } = business;
			res.status(200).json({ owner, membership });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put(
	'/membership/:businessNameEncoded',
	isAuthenticated,
	(req, res, next) => {
		const buzName = req.params.businessNameEncoded.split('-').join(' ');

		const { selectedPlan, usedTrial } = req.body;

		const newTrialStatus = usedTrial || selectedPlan === 'trial' ? true : false;

		const membership = {
			plan: selectedPlan,
			updated: new Date(),
			usedTrial: newTrialStatus,
		};

		Business.findOneAndUpdate({ name: buzName }, { membership }, { new: true })
			.then((business) => {
				res.status(200).json(business);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: 'Sorry internal error occurred' });
			});
	}
);

router.put(
	'/highlightedProducts/:businessID',
	isAuthenticated,
	(req, res, next) => {
		const businessID = req.params.businessID;
		const { productID } = req.body;

		Business.findById(businessID)
			.then((businessFound) => {
				if (businessFound.highlightedProducts === undefined) {
					return Business.findByIdAndUpdate(
						businessID,
						{ $push: { highlightedProducts: productID } },
						{ new: true }
					)
						.populate('products')
						.populate('employees')
						.populate('orders')
						.populate({
							path: 'orders',
							populate: {
								path: 'business',
							},
						})
						.populate({
							path: 'orders',
							populate: {
								path: 'user',
							},
						})
						.populate({
							path: 'orders',
							populate: {
								path: 'products',
								populate: {
									path: 'product',
								},
							},
						});
				} else if (businessFound.highlightedProducts.includes(productID)) {
					return Business.findByIdAndUpdate(
						businessID,
						{ $pull: { highlightedProducts: productID } },
						{ new: true }
					)
						.populate('products')
						.populate('employees')
						.populate('orders')
						.populate({
							path: 'orders',
							populate: {
								path: 'business',
							},
						})
						.populate({
							path: 'orders',
							populate: {
								path: 'user',
							},
						})
						.populate({
							path: 'orders',
							populate: {
								path: 'products',
								populate: {
									path: 'product',
								},
							},
						});
				} else {
					return Business.findByIdAndUpdate(
						businessID,
						{ $push: { highlightedProducts: productID } },
						{ new: true }
					)
						.populate('products')
						.populate('employees')
						.populate('orders')
						.populate({
							path: 'orders',
							populate: {
								path: 'business',
							},
						})
						.populate({
							path: 'orders',
							populate: {
								path: 'user',
							},
						})
						.populate({
							path: 'orders',
							populate: {
								path: 'products',
								populate: {
									path: 'product',
								},
							},
						});
				}
			})
			.then((businessUpdated) => {
				res.status(200).json(businessUpdated);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: 'Sorry internal error occurred' });
			});
	}
);

router.put('/reorder/:businessID', (req, res, next) => {
	const businessID = req.params.businessID;
	const { field, array } = req.body;
	const newArray = array[0]._id ? array.map((elem) => elem._id) : array;
	// console.log(newArray)
	// return newArray

	Business.findByIdAndUpdate(businessID, { [field]: newArray }, { new: true })
		.populate('products')
		.populate('employees')
		.populate('orders')
		.populate({
			path: 'orders',
			populate: {
				path: 'business',
			},
		})
		.populate({
			path: 'orders',
			populate: {
				path: 'user',
			},
		})
		.populate({
			path: 'orders',
			populate: {
				path: 'products',
				populate: {
					path: 'product',
				},
			},
		})
		.then((business) => {
			res.status(200).json(business);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.get('/dashboard/:businessNameEncoded', (req, res, next) => {
	const name = req.params.businessNameEncoded.split('-').join(' ');

	Business.findOne({ name })
		.populate({
			path: 'orders',
			select:
				'products business status summary paymentMethod format user note createdAt',
			populate: [
				{
					path: 'products',
					populate: {
						path: 'product',
						select: 'status name price mainImg',
					},
				},
				{
					path: 'business',
					select: 'currency logoUrl name',
				},
				{
					path: 'user',
					select: 'name avatarUrl',
				},
			],
		})
		// .populate('products')
		// .populate('employees')
		// .populate('orders')
		// .populate({
		// 	path: 'orders',
		// 	populate: {
		// 		path: 'business',
		// 	},
		// })
		// .populate({
		// 	path: 'orders',
		// 	populate: {
		// 		path: 'user',
		// 	},
		// })
		// .populate({
		// 	path: 'orders',
		// 	populate: {
		// 		path: 'products',
		// 		populate: {
		// 			path: 'product',
		// 		},
		// 	},
		// })
		.then((business) => {
			if (business) {
				res.status(200).json({ business });
			} else {
				res.status(400).json({ message: 'Business does not exists.' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

module.exports = router;
