const router = require('express').Router();

const Business = require('../models/Bussiness.model');


router.post('/create', (req, res, next) => {
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
		});
	})
    .then(business =>{
        res.status(201).json({ business:business });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Could not create the Business, check data and try again" })
      });
});


module.exports = router;
