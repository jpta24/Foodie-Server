const router = require('express').Router();

const sendMail = require('../config/nodemailer.config');
const {
	mailStatusClient,
	mailStatusBusiness,
	mailStatusClientBusiness,
	mailStatusBusinessBusiness,
} = require('../data/mails');

const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Business = require('../models/Bussiness.model');

router.put('/status/:orderID', (req, res, next) => {
	const { status } = req.body;
	Order.findByIdAndUpdate(req.params.orderID, { status }, { new: true })
		.populate('user')
		.populate('business')
		.populate({
			path: 'products',
			populate: {
				path: 'product',
			},
		})
		.then((updatedOrder) => {
			const thisOrder = updatedOrder;
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
			// Mail to Client when Client Change Order Status
			const mailOptionsStatusClient = {
				from: 'info@foodys.app',
				to: thisOrder.user.email,
				subject: `You have ${thisOrder.status.toUpperCase()} your Foodys Order ${ordNum
					.slice(10)
					.toUpperCase()}`,
				html: mailStatusClient(thisOrder, ordNum),
			};

			sendMail(mailOptionsStatusClient);

			// Mail to Business when Client Change Order Status
			const mailOptionsStatusBusiness = {
				from: 'info@foodys.app',
				to: thisOrder.business.address.email,
				subject: `Client has ${thisOrder.status.toUpperCase()} your Foodys Order ${ordNum
					.slice(10)
					.toUpperCase()}`,
				html: mailStatusBusiness(thisOrder, ordNum),
			};

			sendMail(mailOptionsStatusBusiness);

			return User.findById(updatedOrder.user._id)
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
				});
		})
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Sorry internal error occurred' });
		});
});

router.put('/statusBusiness/:orderID', (req, res, next) => {
	const { status } = req.body;
	Order.findByIdAndUpdate(req.params.orderID, { status }, { new: true })
		.populate('user')
		.populate('business')
		.populate({
			path: 'products',
			populate: {
				path: 'product',
			},
		})
		.then((updatedOrder) => {
			const thisOrder = updatedOrder;
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

			// Mail to Client when Business Change Order Status
			const mailOptionsStatusClient = {
				from: 'info@foodys.app',
				to: thisOrder.user.email,
				subject: `${
					thisOrder.business.name
				} has ${thisOrder.status.toUpperCase()} your Foodys Order ${ordNum
					.slice(10)
					.toUpperCase()}`,
				html: mailStatusClientBusiness(thisOrder, ordNum),
			};

			sendMail(mailOptionsStatusClient);

			// Mail to Business when Business Change Order Status
			const mailOptionsStatusBusiness = {
				from: 'info@foodys.app',
				to: thisOrder.business.address.email,
				subject: `You have ${thisOrder.status.toUpperCase()} Order ${ordNum
					.slice(10)
					.toUpperCase()}`,
				html: mailStatusBusinessBusiness(thisOrder, ordNum),
			};

			sendMail(mailOptionsStatusBusiness);

			return Business.findById(updatedOrder.business)
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
		})
		.then((businessUpdated) => {
			const business = businessUpdated;
			res.status(200).json(businessUpdated);
		});
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

module.exports = router;
