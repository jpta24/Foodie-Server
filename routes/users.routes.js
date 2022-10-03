const router = require('express').Router();

const User = require('../models/User.model');

router.get('/:userID', (req, res, next) => {
	User.findById(req.params.userID)
		.populate('business')
		.populate('savedBusiness')
		.populate('savedProducts')
		.populate('orders')
		.populate('cart')
		.then((user) => res.json(user))
		.catch((err) => next(err));
});

router.put('/:userID', (req, res, next) => {
	const { _id,username,email,avatarUrl, rol,business,savedBusines,savedProducts,orders  } = req.body;
    User.findByIdAndUpdate(req.params.userID);
});

module.exports = router;
