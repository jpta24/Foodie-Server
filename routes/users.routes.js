const router = require('express').Router();
const nodemailer = require('nodemailer');

const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');
const Order = require('../models/Order.model');

const mail = require('../data/mails');

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
	console.log(cart)
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
	User.findByIdAndUpdate(userID, { $pull: { cart: { _id: product } } })
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
			.then(() => {
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

				const transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: process.env.EMAIL,
						pass: process.env.PASSMAIL,
					},
				});

				let mailOrderClient = {
					from: process.env.MAIL,
					to: userUpdated.email,
					subject: 'Your Foodie Order',
					html: `
                <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
                    <div>
                        <div style='padding:10px'>
                            <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                                <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                                <h1 style='margin-left:15px'>Foodie</h1>
                            </a>
                        </div>
                        <div style='padding:10px'>
                            <h1 style='margin-top:3px'>Hi ${
															userUpdated.username
														},</h1>
                            <p>Thanks for your order with us. We’ll send you a confirmation when the business receives it.</p>
                            <div>
                                <div>
                                    <div>
                                        <hr/>
                                        <h3>Details <span style='padding-left:10px'>Order ${ordNum
																					.slice(10)
																					.toUpperCase()}</span></h3>
                                        <p style='font-size:0.95em; font-weight:bolder'>Business: ${
																					thisOrder.business.name
																				}</p>
                                        <div>
                                            ${orders}
                                        </div>
                                        <hr/>
                                        <h3>Information</h3>
                                        <p>Name: ${thisOrder.note.name} </p>
                                        <p>Phone: ${thisOrder.note.phone}</p>
                                        ${
																					thisOrder.note.street &&
																					`<p>Address: ${thisOrder.note.street}</p>`
																				}
                                        ${
																					thisOrder.note.note &&
																					`<p>Note: ${thisOrder.note.note}</p>`
																				}
                                        <p>Delivery Service: ${
																					thisOrder.format
																				}</p>
                                        <hr/>
                                        <p>Summary: <span style='font-weight: bolder'>${
																					thisOrder.business.currency
																				} ${thisOrder.summary.toFixed(
						2
					)}</span></p>
                                        <p>Payment Method: <span style='font-weight: bolder'>${
																					thisOrder.paymentMethod
																				}</span></p>
                                        <p>Order status: <span style='font-weight: bolder'>${
																					thisOrder.status
																				}</span> 
                                        </p>
                                        <hr/>
                                        <p>We hope to see you again soon.</p>
                                        <h3>Foodie.de</h3>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
                `,
				};

				transporter.sendMail(mailOrderClient, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log('Email Order to Client sent: ' + info.response);
					}
				});

				let mailOrderBusiness = {
					from: process.env.MAIL,
					to: thisOrder.business.address.email,
					subject: 'You recieved a Foodie Order',
					html: `
                    <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
                        <div>
                            <div style='padding:10px'>
                                <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                                    <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                                    <h1 style='margin-left:15px'>Foodie</h1>
                                </a>
                            </div>
                            <div style='padding:10px'>
                                <h1 style='margin-top:3px'>Hi ${
																	thisOrder.business.name
																},</h1>
                                <p>You have received an order, please check it and confirm it to let the client know everything is Ok. </p>
                                <div>
                                    <div>
                                        <div>
                                            <hr/>
                                            <h3>Details <span style='padding-left:10px'>Order ${ordNum
																							.slice(10)
																							.toUpperCase()}</span></h3>
                                            <p style='font-size:0.95em; font-weight:bolder'>User: ${
																							userUpdated.username
																						}</p>
                                            <div>
                                                ${orders}
                                            </div>
                                            <hr/>
                                            <h3>Information</h3>
                                            <p>Name: ${thisOrder.note.name} </p>
                                            <p>Phone: ${
																							thisOrder.note.phone
																						}</p>
                                            ${
																							thisOrder.note.street &&
																							`<p>Address: ${thisOrder.note.street}</p>`
																						}
                                            ${
																							thisOrder.note.note &&
																							`<p>Note: ${thisOrder.note.note}</p>`
																						}
                                            <p>Delivery Service: ${
																							thisOrder.format
																						}</p>
                                            <hr/>
                                            <p>Summary: <span style='font-weight: bolder'>${
																							thisOrder.business.currency
																						} ${thisOrder.summary.toFixed(
						2
					)}</span></p>
                                            <p>Payment Method: <span style='font-weight: bolder'>${
																							thisOrder.paymentMethod
																						}</span></p>
                                            <p>Order status: <span style='font-weight: bolder'>${
																							thisOrder.status
																						}</span> 
                                            </p>
                                            <hr/>
                                            <p>Thanks for using our service.</p>
                                            <h3>Foodie.de</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `,
				};

				transporter.sendMail(mailOrderBusiness, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log('Email Order to Business sent: ' + info.response);
					}
				});

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

router.post('/test/:userID', (req, res, next) => {
	const userID = req.params.userID;

	User.findById(userID).then((resp) => {
		res
			.status(200)
			.json(resp.savedBusiness.includes('633fe7aca2b8a625c4c53207'));
	});
});

module.exports = router;
