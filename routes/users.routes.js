const router = require('express').Router();

const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');
const Order = require('../models/Order.model');


router.get('/:userID', (req, res, next) => {
	User.findById(req.params.userID)
		.populate('business')
		.populate(({
            path: 'cart',
            populate: {
              path: "product",
                populate: {
                    path:"business"
                }
            }
          })).populate(({
            path: 'orders',
            populate: {
              path: "business"
            }
          })).populate(({
            path: 'orders',
            populate: {
              path: "products",
                populate: {
                    path: "product"
                }
            }
          }))
		.then((user) => res.json(user))
		.catch((err) => next(err));
});

router.put('/rol/:userID', (req, res, next) => {
    const userID = req.params.userID

    const {rol, buzname} = req.body

    Business.findOne({ name:buzname})
        .then((foundBusiness) => {
            if (!foundBusiness) {
                res.status(400).json({ message: 'Business does not exists.' });
            return;
            }
            return User.findByIdAndUpdate(userID,{business:foundBusiness._id,rol:rol},{new:true})
            .then((user)=>{
                return Business.findByIdAndUpdate(foundBusiness._id,{$push:{'employees':user._id}},{new:true})
            }).then(businessUpdated =>{
                res.status(200).json({ business:businessUpdated });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: "Sorry internal error occurred" })
                });

            // return Business.findByIdAndUpdate(foundBusiness._id,{employee})
        }).catch(err => {
            console.log(err)
            res.status(500).json({ message: "Sorry internal error occurred" })
            });
    
});

router.put('/addCart/:userID', (req, res, next) => {
    const userID = req.params.userID

    const {cart} = req.body
    User.findByIdAndUpdate(userID,{$push:{cart:cart}},{new:true})
    .then((user)=>{
        res.status(200).json(user)})
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
        });
    
});

router.put('/addQtyCart/:userID', (req, res, next) => {
    const userID = req.params.userID

    const {cart} = req.body
    User.findByIdAndUpdate(userID,{$inc:{'cart.$[elem].quantity':1}},{ arrayFilters: [ { 'elem.product': cart.product } ], new:true },)
    .then((user)=>{
        res.status(200).json(user)})
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
        });
});

router.put('/removeQtyCart/:userID', (req, res, next) => {
    const userID = req.params.userID

    const {cart} = req.body
    User.findByIdAndUpdate(userID,{$inc:{'cart.$[elem].quantity':-1}},{ arrayFilters: [ { 'elem.product': cart.product } ], new:true },)
    .then((user)=>{
        res.status(200).json(user)})
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
        });
    
});

router.put('/removeCart/:userID', (req, res, next) => {
    const userID = req.params.userID
    
    const {product} = req.body
    User.findByIdAndUpdate(userID,{$pull: { cart: { _id: product }}})
        .then((user)=>{
            res.status(200).json(user)})
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Sorry internal error occurred" })
            });
});

router.put('/order/:userID', (req, res, next) => {
    const userID = req.params.userID
    
    const {orders} = req.body;
    orders.map(order=>{
        let orderID 
        let userUpdated
        Order.create(order)
        .then(createdOrder=>{
            orderID = createdOrder._id
            return User.findByIdAndUpdate(order.user,{$push:{orders:createdOrder._id}, $set: { cart: [] }},{new:true}).populate('business')
            .populate(({
                path: 'cart',
                populate: {
                  path: "product",
                    populate: {
                        path:"business"
                    }
                }
              })).populate(({
                path: 'orders',
                populate: {
                  path: "business"
                }
              })).populate(({
                path: 'orders',
                populate: {
                  path: "products",
                    populate: {
                        path: "product"
                    }
                }
              }))
        }).then(user=>{
            userUpdated = user
            return Business.findByIdAndUpdate(order.business,{$push:{orders:orderID}})
        }).then(()=>{
            res.status(200).json(userUpdated)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Sorry internal error occurred" })
            });

    })
});

module.exports = router;
