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
        categories,
        status
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
        categories,
        status
        })
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
        res.status(200).json(product)})
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
        });
    
});

router.put('/edit/:productID', (req, res, next) => {
    const productID = req.params.productID

    const {name,mainImg,description,type,price,ingredients,categories,status} = req.body
    Product.findByIdAndUpdate(productID,{name,mainImg,description,type,price,ingredients,categories,status},{new:true})
    .then((product)=>{
        res.status(200).json(product)})
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
        });
    
});

router.get('/:productID',(req,res,next) =>{
    const productID = req.params.productID

    Product.findById(productID).populate('business')
    .then(product=>{
        if (product) {
            res.status(200).json({ product });
        }else{
            res.status(400).json({ message: 'Product does not exists.' });
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
      });
})

router.delete('/delete/:productID', (req, res) => {
    const { productID } = req.params;

    Product.findByIdAndRemove(productID)
        .then(product => {
            res.json({message: `Project with the id ${product._id} was successfully deleted`})})
        .catch(err => console.log(err))
})

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

module.exports = router;
