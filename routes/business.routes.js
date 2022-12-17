const router = require('express').Router();
const nodemailer = require("nodemailer");

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
    currency,
    payment
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
      currency,
      payment
		});
	})
    .then(business =>{
        User.findByIdAndUpdate(owner,{business:business._id,rol:'admin'},{new:true}).
        then((userUpdated) =>{
          const user = userUpdated
          // Send email confirmation create a Business
        const transporter = nodemailer.createTransport({
          service:'gmail',
          auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSMAIL
          }
        });
        let mailCreateBusiness = {
          from: process.env.MAIL,
          to: address.email,
          subject: 'You successfully created a Foodie Business account!',
          html: `
          <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
              <div>
                  <div style='padding:10px'>
                      <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                          <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                          <h1 style='margin-left:15px'>Foodie</h1>
                      </a>
                  </div>
                  <div style='padding:10px'>
                      <h1 style='margin-top:3px'>Hi ${userUpdated.username},</h1>
                      <p>Welcome to Foodie. </p>
                      <h3>You have created a business named: <span style='padding-left:10px'>Order ${name}</span></h3>
                      <div>
                          <div>
                              <div>
                                  <hr/>
                                  <h3>Thanks for signing up for a FREE account.  You can now start setting up your Business account get your QR code and bring clients to your business. </h3>
                                  <p>If you didn't sign up for an account please ignore  this email.  Someone probably made a typo and entered your email address on accident.</p>
                                  
                                  <p>Thanks for using our service.</p>
                                  <h3>Foodie.de</h3>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          `
          };

          transporter.sendMail(mailCreateBusiness , function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email Create Business Account sent: ' + info.response);
              }
            });

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


module.exports = router;
