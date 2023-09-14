const router = require('express').Router();

const sendMail = require('../config/nodemailer.config');
const { mailOrderClient, mailOrderBusiness } = require('../data/mails');

const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');
const Order = require('../models/Order.model');

const mail = require('../data/mails');
const Invoice = require('../models/Invoice.model');

router.get('/:userID', (req, res, next) => {
	User.findById(req.params.userID)
		.populate('business')
		.populate({
			path: 'cart',
			populate: {
				path: 'product',
				populate: {
					path: 'business',
				},
			},
		})
		.populate({
			path: 'orders',
			populate: {
				path: 'business',
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
		.then((foundUser) => {
			const {
				username,
				email,
				avatarUrl,
				name,
				phone,
				rol,
				business,
				visitedBusiness,
				savedBusiness,
				savedProducts,
				orders,
				cart,
				_id,
			} = foundUser;
			const user = {
				username,
				email,
				avatarUrl,
				name,
				phone,
				rol,
				business,
				visitedBusiness,
				savedBusiness,
				savedProducts,
				orders,
				cart,
				_id,
			};
			res.json(user);
		})
		.catch((err) => next(err));
});

router.put('/rol/:userID', (req, res, next) => {
	const userID = req.params.userID;

	const { rol, buzname } = req.body;

	Business.findOne({ name: buzname })
		.then((foundBusiness) => {
			if (!foundBusiness) {
				res.status(400).json({ message: 'Business does not exists.' });
				return;
			}
			return User.findByIdAndUpdate(
				userID,
				{ business: foundBusiness._id, rol: rol },
				{ new: true }
			)
				.then((user) => {
					return Business.findByIdAndUpdate(
						foundBusiness._id,
						{ $push: { employees: user._id } },
						{ new: true }
					);
				})
				.then((businessUpdated) => {
					res.status(200).json({ business: businessUpdated });
				})
				.catch((err) => {
					console.log(err);
					res.status(500).json({ message: 'Sorry internal error occurred' });
				});

			// return Business.findByIdAndUpdate(foundBusiness._id,{employee})
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/addCart/:userID', (req, res, next) => {
	const userID = req.params.userID;

	const { cart } = req.body;
	console.log(cart);
	User.findByIdAndUpdate(userID, { $push: { cart: cart } }, { new: true })
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/addQtyCart/:userID', (req, res, next) => {
	const userID = req.params.userID;

	const { cart } = req.body;
	User.findByIdAndUpdate(
		userID,
		{ $inc: { 'cart.$[elem].quantity': cart.quantity } },
		{ arrayFilters: [{ 'elem.product': cart.product }], new: true }
	)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/removeQtyCart/:userID', (req, res, next) => {
	const userID = req.params.userID;

	const { cart } = req.body;
	User.findByIdAndUpdate(
		userID,
		{ $inc: { 'cart.$[elem].quantity': -cart.quantity } },
		{ arrayFilters: [{ 'elem.product': cart.product }], new: true }
	)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/removeCart/:userID', (req, res, next) => {
	const userID = req.params.userID;

	const { product } = req.body;
	User.findByIdAndUpdate(userID, { $pull: { cart: { product: product } } })
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/order/:userID', (req, res, next) => {
	const userID = req.params.userID;

	const { order } = req.body;
	Order.create(order).then((createdOrder) => {
		let orderID = createdOrder._id;
		let products = createdOrder.products.map((elem) => elem.product._id);
		return User.findByIdAndUpdate(
			order.user,
			{
				$push: { orders: createdOrder._id },
				$pull: { cart: { product: { $in: products } } },
			},
			{ new: true }
		)
			.populate('business')
			.populate({
				path: 'cart',
				populate: {
					path: 'product',
					populate: {
						path: 'business',
					},
				},
			})
			.populate({
				path: 'orders',
				populate: {
					path: 'business',
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
			.then((user) => {
				userUpdated = user;
				return Business.findByIdAndUpdate(order.business, {
					$push: { orders: orderID },
				});
			})
			.then(async (business) => {
				const businessComisionInvoice = business.invoices.filter((invoice) => {
					return (
						(invoice.status === 'notCreated' || invoice.status === 'pending') &&
						invoice.code === 'comision'
					);
				});

				if (businessComisionInvoice.length > 0) {
					const activeMembership = business.membership.filter((membership) => membership.status === 'active')[0];

					const isComisionable =
						createdOrder.paymentMethod !== 'card' &&
						createdOrder.paymentMethod !== 'pp';

					if (isComisionable) {
						businessComisionInvoice[0].price +=
							createdOrder.summary * (activeMembership.plan.comision / 100);
						businessComisionInvoice[0].orders.notPayed.push(createdOrder._id);
						//verificar invoice stauts y cambiarlo
						if (businessComisionInvoice[0].status === 'notCreated') {
							businessComisionInvoice[0].status ='pending'
						}
					} else {
						businessComisionInvoice[0].orders.payed.push(createdOrder._id);
					}
					businessComisionInvoice[0].save();
				} else {
					console.log('No Invoices with these Criteria.');
				}

				const thisOrder = userUpdated.orders[userUpdated.orders.length - 1];
				const ordNum = thisOrder._id + '';
				const orders = thisOrder.products
					.map((eachProduct) => {
						return `<p>
                    <span style='padding-left: 5px'>${
											eachProduct.quantity + ' ' + eachProduct.product.name
										}</span><span>${' ' + thisOrder.business.currency} ${(
							eachProduct.product.price * eachProduct.quantity
						).toFixed(2)}</span></p>`;
					})
					.join(' ');

				const mailOptionsClient = {
					from: 'FOODYS APP <info@foodys.app>',
					to: userUpdated.email,
					subject: 'Your Foodys Order',
					html: mailOrderClient(userUpdated, orders, thisOrder, ordNum),
				};

				await sendMail(mailOptionsClient);

				const mailOptionsBusiness = {
					from: 'FOODYS APP <info@foodys.app>',
					to: thisOrder.business.address.email,
					subject: 'You recieved a Foodys Order',
					html: mailOrderBusiness(userUpdated, orders, thisOrder, ordNum),
				};

				await sendMail(mailOptionsBusiness);

				res.status(200).json(userUpdated);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: 'Sorry internal error occurred' });
			});
	});
});

router.put('/visitedBusiness/:userID', (req, res, next) => {
	const userID = req.params.userID;
	const newBuz = req.body;
	User.findByIdAndUpdate(userID, {
		$addToSet: { visitedBusiness: { $each: newBuz } },
	})
		.populate('visitedBusiness')
		.populate('business')
		.then((foundUser) => {
			const {
				username,
				email,
				avatarUrl,
				name,
				phone,
				rol,
				business,
				visitedBusiness,
				savedBusiness,
				savedProducts,
				orders,
				cart,
				_id,
			} = foundUser;
			const user = {
				username,
				email,
				avatarUrl,
				name,
				phone,
				rol,
				business,
				visitedBusiness,
				savedBusiness,
				savedProducts,
				orders,
				cart,
				_id,
			};
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/language/:userID', (req, res, next) => {
	const userID = req.params.userID;
	const lang = req.body;

	User.findByIdAndUpdate(userID, { lang: lang.lang })
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.get('/language/:userID', (req, res, next) => {
	const userID = req.params.userID;

	User.findById(userID)
		.then((user) => {
			const lang = user.lang;
			res.status(200).json({ lang });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.get('/home/:userID', (req, res, next) => {
	const userID = req.params.userID;

	User.findById(userID)
		.populate('business')
		.then((userFound) => {
			const membership = userFound.business
				? userFound.business.membership
				: undefined;
			const name = userFound.business ? userFound.business.name : undefined;
			res.status(200).json({ membership, name });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/edit-profile/:userID', (req, res, next) => {
	const userID = req.params.userID;

	const { name, phone, avatarUrl } = req.body;

	User.findByIdAndUpdate(userID, { name, phone, avatarUrl })
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.get('/saved/:userID', (req, res, next) => {
	const userID = req.params.userID;

	User.findById(userID)
		.then((userFound) => {
			const savedBusiness = userFound.savedBusiness;
			const savedProducts = userFound.savedProducts;
			res.status(200).json({ savedBusiness, savedProducts });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/savedProduct/:userID', (req, res, next) => {
	const userID = req.params.userID;
	const { productID } = req.body;

	User.findById(userID)
		.then((userFound) => {
			if (userFound.savedProducts.includes(productID)) {
				return User.findByIdAndUpdate(
					userID,
					{ $pull: { savedProducts: productID } },
					{ new: true }
				);
			} else {
				return User.findByIdAndUpdate(
					userID,
					{ $push: { savedProducts: productID } },
					{ new: true }
				);
			}
		})
		.then((userUpdated) => {
			const savedBusiness = userUpdated.savedBusiness;
			const savedProducts = userUpdated.savedProducts;
			console.log(userUpdated.savedProducts);
			res.status(200).json({ savedBusiness, savedProducts });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/savedBusiness/:userID', (req, res, next) => {
	const userID = req.params.userID;
	const { businessID } = req.body;

	User.findById(userID)
		.then((userFound) => {
			if (userFound.savedBusiness?.includes(businessID)) {
				return User.findByIdAndUpdate(
					userID,
					{ $pull: { savedBusiness: businessID } },
					{ new: true }
				);
			} else {
				return User.findByIdAndUpdate(
					userID,
					{ $push: { savedBusiness: businessID } },
					{ new: true }
				);
			}
		})
		.then((userUpdated) => {
			const savedBusiness = userUpdated.savedBusiness;
			const savedProducts = userUpdated.savedProducts;
			res.status(200).json({ savedBusiness, savedProducts });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/mode/:userID', (req, res, next) => {
	const userID = req.params.userID;
	const mode = req.body;

	User.findByIdAndUpdate(userID, { isDark: mode.mode })
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.get('/mode/:userID', (req, res, next) => {
	const userID = req.params.userID;

	User.findById(userID)
		.then((user) => {
			const mode = user.isDark;
			res.status(200).json({ mode });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/reorder/:userID', (req, res, next) => {
	const userID = req.params.userID;
	const { field, array } = req.body;

	User.findByIdAndUpdate(
		userID,
		{ [field]: array.map((elem) => elem._id) },
		{ new: true }
	)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.get('/sidebar/:userID', (req, res, next) => {
	const userID = req.params.userID;

	User.findById(userID)
		.populate({
			path: 'business',
			select: 'name logoUrl',
		})
		.select('business name avatarUrl')
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.get('/navbar/:userID', (req, res, next) => {
	const userID = req.params.userID;

	User.findById(userID)
		.populate({
			path: 'business',
			select: 'name',
		})
		.select('business')
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.get('/dashboard/:userID', (req, res, next) => {
	const userID = req.params.userID;

	User.findById(userID)
		.populate({
			path: 'cart',
			populate: {
				path: 'product',
				select: 'status mainImg name price',
				populate: {
					path: 'business',
					select: 'currency',
				},
			},
		})
		.populate({
			path: 'orders',
			select: 'products business status summary paymentMethod format',
			populate: [
				{
					path: 'products',
					populate: {
						path: 'product',
						select: 'status name price',
					},
				},
				{
					path: 'business',
					select: 'currency logoUrl name',
				},
			],
		})
		.populate({ path: 'savedBusiness', select: 'name bgUrl logoUrl' })
		.populate({ path: 'visitedBusiness', select: 'name bgUrl logoUrl' })
		.select('cart orders savedBusiness visitedBusiness')
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.post('/test/:userID', (req, res, next) => {
	const userID = req.params.userID;

	User.findById(userID).then((resp) => {
		res
			.status(200)
			.json(resp.savedBusiness.includes('633fe7aca2b8a625c4c53207'));
	});
});

module.exports = router;
