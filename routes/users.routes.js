const router = require('express').Router();

const Business = require('../models/Bussiness.model');
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
    const userID = req.params.userID
    const {update} = req.body

    if (update === 1) {
        const {rol, buzname} = req.body
        console.log(rol);
    
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
   	
});

module.exports = router;
