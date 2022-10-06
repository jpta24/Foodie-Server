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
              path: "product"
            }
          }))
		.then((user) => res.json(user))
		.catch((err) => next(err));
});

router.put('/:userID', (req, res, next) => {
    const userID = req.params.userID
    const {update} = req.body

    if (update === 'rol') {
        const {rol, buzname} = req.body
        // console.log(rol);
    
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
    }

    if (update === 'cart') {
    
        // console.log(update)
        const {cart} = req.body
        User.findByIdAndUpdate(userID,{$push:{cart:cart}})
        .then((user)=>{
            res.status(200).json(user)})
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Sorry internal error occurred" })
          });
    }
    //Pending
    if (update === 'cartQty'){
        const {cart} = req.body
        
        console.log(cart.product);
        User.findById(userID).populate(({
            path: 'cart',
            populate: {
              path: "product"
            }
            })).updateOne(
            {
                "$set": {'quantity': cart.quantity}
            },
            {
                "arrayFilters": [{'product': cart.product._id}]
            }
            ).then((user)=>{
                console.log(user);
                res.status(200).json(user)})
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: "Sorry internal error occurred" })
              });
    }

    if(update==='order'){
        const {orders} = req.body
        orders.map(order=>{
            Order.create(order)
            .then(createdOrder=>{
                return User.findByIdAndUpdate(order.user,{$push:{orders:createdOrder._id}, $set: { cart: [] }})
            }).then(userUpdated=>{
                res.status(200).json(userUpdated)
            }).catch(err => {
                console.log(err)
                res.status(500).json({ message: "Sorry internal error occurred" })
              });

        })
    }
   	
});

module.exports = router;
