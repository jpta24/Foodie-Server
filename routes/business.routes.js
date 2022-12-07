const router = require('express').Router();

const Business = require('../models/Bussiness.model');
const User = require('../models/User.model');

const { isAuthenticated } = require("../middleware/jwt.middleware");


router.post('/', isAuthenticated, (req, res, next) => {
	const {
		name,
		logoUrl,
		address,
		format,
		type,
		categories,
		bgUrl,
		pdfMenu,
		employees,
		owner,
    currency
	} = req.body;

    if(format.delivery === false && format.pickup === false && format.inplace===false){
        res.status(400).json({ message: "Please select at least one delivery format" });
        return;
    }

    if (type.prepared === false && type.packed === false && type.frozen===false){
        res.status(400).json({ message: "Please select at least one Product Type" });
        return;
    }
    if (categories.length===0){
        res.status(400).json({ message: "Please select at least one Catalog Category" });
        return;
    }

    if (name === '' || address.street === '' || address.city === '' || address.country === '' ) {
        res.status(400).json({ message: "Provide a correct Name and Address " });
        return;
      }

	Business.findOne({ name }).then((foundBusiness) => {
		if (foundBusiness) {
			res.status(400).json({ message: 'Business already exists.' });
			return;
		}
        
		return Business.create({
			name,
			logoUrl,
			address,
			format,
			type,
			categories,
			bgUrl,
			pdfMenu,
			employees,
			owner,
      currency
		});
	})
    .then(business =>{
        User.findByIdAndUpdate(owner,{business:business._id,rol:'admin'},{new:true}).
        then(() =>{
            res.status(201).json({ business:business });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ message: "Could not Update the user Business" })
          });
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Could not create the Business, check data and try again" })
      });
});

router.get('/:businessNameEncoded',(req,res,next) =>{
    const name = req.params.businessNameEncoded.split('-').join(' ')

    Business.findOne({name}).populate('products').populate('employees').populate('orders').populate(({
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
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Sorry internal error occurred" })
      });

})

// router.get('/id/:businessID',(req,res,next) =>{
//     Business.findById(req.params.businessID).populate('products').populate('employees').populate('orders').populate(({
//         path: 'orders',
//         populate: {
//           path: "business"
//         }
//       })).populate(({
//         path: 'orders',
//         populate: {
//           path: "products",
//             populate: {
//                 path: "product"
//             }
//         }
//       }))
//     .then(business=>{
//         if (business) {
//             res.status(200).json({ business });
//         }else{
//             res.status(400).json({ message: 'Business does not exists.' });
//         }
//     })
//     .catch(err => {
//         console.log(err)
//         res.status(500).json({ message: "Sorry internal error occurred" })
//       });

// })

module.exports = router;
