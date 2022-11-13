const router = require("express").Router();

const Order = require('../models/Order.model');
const User = require('../models/User.model');

router.put("/status/:orderID", (req, res, next) => {
    const {status} = req.body;
    Order.findByIdAndUpdate(req.params.orderID, {status},{new:true})
    .then((updatedOrder)=>{
        console.log(updatedOrder);
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

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

module.exports = router;