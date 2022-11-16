const router = require("express").Router();

const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Business = require('../models/Bussiness.model');

router.put("/status/:orderID", (req, res, next) => {
    const {status} = req.body;
    Order.findByIdAndUpdate(req.params.orderID, {status},{new:true})
    .then((updatedOrder)=>{
        return User.findById(updatedOrder.user._id)
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
    })
    .then((user) => {
        res.status(200).json(user)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
      });
});

router.put("/statusBusiness/:orderID", (req, res, next) => {
    const {status} = req.body;
    Order.findByIdAndUpdate(req.params.orderID, {status},{new:true})
      .then((updatedOrder)=>{
        return Business.findById(updatedOrder.business).populate('products').populate('employees').populate('orders').populate(({
            path: 'orders',
            populate: {
              path: "business"
            }
          })).populate(({
            path: 'orders',
            populate: {
              path: "user"
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
      })
      .then((businessUpdated) => {
        res.status(200).json(businessUpdated)
    })
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

module.exports = router;

/* const {status} = req.body;
    Order.findByIdAndUpdate(req.params.orderID, {status},{new:true}).populate('business').populate(({
        path: 'business',
        populate: {
          path: "owner"
        }
      }))
    .then((updatedOrder)=>{
        return Business.findOne({name}).populate('products').populate('employees').populate('orders').populate(({
            path: 'orders',
            populate: {
              path: "business"
            }
          })).populate(({
            path: 'orders',
            populate: {
              path: "user"
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
        .then(business=>{
            if (business) {
                res.status(200).json({ business });
            }else{
                res.status(400).json({ message: 'Business does not exists.' });
            })


    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
      }); */