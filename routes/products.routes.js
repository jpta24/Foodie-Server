const router = require("express").Router();

const Business = require('../models/Bussiness.model');
const Product = require('../models/Product.model');


router.post("/", (req, res, next) => {
    const {
		name,
        mainImg,
        description,
        business,
        type,
        price,
		ingredients,
        categories
	} = req.body;
    
    if (name === '' ) {
        res.status(400).json({ message: "Please provide a Name for your Product " });
        return;

      }
          
    Product.create({name,
        mainImg,
        description,
        business,
        type,
        price,
		ingredients,
        categories})
        .then(product =>{
            return Business.findByIdAndUpdate(business,{$push:{products:product._id}},{new:true}) 
        })
        .then((business) =>{
            res.status(200).json(business);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Could not create the Business, check data and try again" })
          });
});

router.put('/status/:productID', (req, res, next) => {
    const productID = req.params.productID

    const {status} = req.body
    Product.findByIdAndUpdate(productID,{status},{new:true})
    .then((product)=>{
        console.log(product)
        res.status(200).json(product)})
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
        });
    
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

module.exports = router;