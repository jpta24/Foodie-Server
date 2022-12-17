const router = require("express").Router();

const nodemailer = require("nodemailer");

const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Business = require('../models/Bussiness.model');

router.put("/status/:orderID", (req, res, next) => {
    const {status} = req.body;
    Order.findByIdAndUpdate(req.params.orderID, {status},{new:true}).populate('user').populate('business').populate(({
      path: 'products',
      populate: {
        path: "product"
      }
    }))
    .then((updatedOrder)=>{
      const thisOrder = updatedOrder
      const ordNum = thisOrder._id + ''
      const orders = thisOrder.products.map(eachProduct=>{
        return `<p>
        <span style='padding-left: 5px'>${ eachProduct.quantity + ' ' + eachProduct.product.name}</span><span>${' ' + thisOrder.business.currency} ${(eachProduct.product.price * eachProduct.quantity).toFixed(2)}</span></p>`
    }).join(' ')

    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSMAIL
        }
      });

    
    let mailStatusClient = {
    from: process.env.MAIL,
    to: thisOrder.user.email,
    subject: `You have ${thisOrder.status} your Foodie Order ${ordNum.slice(10).toUpperCase()}`,
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
                <h1 style='margin-top:3px'>Hi ${thisOrder.user.username},</h1>
                <p>With this mail we would like to let you know that you have <span style='font-weight: bolder'>${thisOrder.status}</span> your order with <span style='font-weight: bolder'>${thisOrder.business.name}</span>.</p>
                <div>
                    <div>
                        <div>
                            <hr/>
                            <h3>Details <span style='padding-left:10px'>Order ${ordNum.slice(10).toUpperCase()}</span></h3>
                            <p style='font-size:0.95em; font-weight:bolder'>Business: ${thisOrder.business.name}</p>
                            <div>
                                ${orders}
                            </div>
                            <hr/>
                            <h3>Information</h3>
                            <p>Name: ${thisOrder.note.name} </p>
                            <p>Phone: ${thisOrder.note.phone}</p>
                            ${thisOrder.note.street && `<p>Address: ${thisOrder.note.street}</p>`}
                            ${thisOrder.note.note && `<p>Note: ${thisOrder.note.note}</p>`}
                            <p>Delivery Service: ${thisOrder.format}</p>
                            <hr/>
                            <p>Summary: <span style='font-weight: bolder'>${thisOrder.business.currency} ${thisOrder.summary.toFixed(2)}</span></p>
                            <p>Payment Method: <span style='font-weight: bolder'>${thisOrder.paymentMethod}</span></p>
                            <p>Order status: <span style='font-weight: bolder'>${thisOrder.status}</span> 
                            </p>
                            <hr/>
                            <p>We hope to see you again soon.</p>
                            <h3>Foodie.de</h3>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    </div>
    `
    };

    transporter.sendMail(mailStatusClient, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email Status to Client sent: ' + info.response);
        }
      });


      let mailStatusBusiness = {
        from: process.env.MAIL,
        to: thisOrder.business.address.email,
        subject: `Client has ${thisOrder.status} your Foodie Order ${ordNum.slice(10).toUpperCase()}`,
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
                    <h1 style='margin-top:3px'>Hi ${thisOrder.business.name},</h1>
                    <p>With this mail we would like to let you know that <span style='font-weight: bolder'>${thisOrder.user.username}</span> has <span style='font-weight: bolder'>${thisOrder.status}</span> the order.</p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Details <span style='padding-left:10px'>Order ${ordNum.slice(10).toUpperCase()}</span></h3>
                                <p style='font-size:0.95em; font-weight:bolder'>User: ${thisOrder.user.username}</p>
                                <div>
                                    ${orders}
                                </div>
                                <hr/>
                                <h3>Information</h3>
                                <p>Name: ${thisOrder.note.name} </p>
                                <p>Phone: ${thisOrder.note.phone}</p>
                                ${thisOrder.note.street && `<p>Address: ${thisOrder.note.street}</p>`}
                                ${thisOrder.note.note && `<p>Note: ${thisOrder.note.note}</p>`}
                                <p>Delivery Service: ${thisOrder.format}</p>
                                <hr/>
                                <p>Summary: <span style='font-weight: bolder'>${thisOrder.business.currency} ${thisOrder.summary.toFixed(2)}</span></p>
                                <p>Payment Method: <span style='font-weight: bolder'>${thisOrder.paymentMethod}</span></p>
                                <p>Order status: <span style='font-weight: bolder'>${thisOrder.status}</span> 
                                </p>
                                <hr/>
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

        transporter.sendMail(mailStatusBusiness, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email Order to Business sent: ' + info.response);
            }
          });


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
    Order.findByIdAndUpdate(req.params.orderID, {status},{new:true}).populate('user').populate('business').populate(({
      path: 'products',
      populate: {
        path: "product"
      }
    }))
      .then((updatedOrder)=>{
        const thisOrder = updatedOrder
        const orders = thisOrder.products.map(eachProduct=>{
          return `<p>
          <span style='padding-left: 5px'>${ eachProduct.quantity + ' ' + eachProduct.product.name}</span><span>${' ' + thisOrder.business.currency} ${(eachProduct.product.price * eachProduct.quantity).toFixed(2)}</span></p>`
      }).join(' ')
  
      const transporter = nodemailer.createTransport({
          service:'gmail',
          auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSMAIL
          }
        });
  
      
      let mailStatusClient = {
      from: process.env.MAIL,
      to: thisOrder.user.email,
      subject: `Your Foodie Order ${ordNum.slice(10).toUpperCase()} has been ${thisOrder.status}`,
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
                  <h1 style='margin-top:3px'>Hi ${thisOrder.user.username},</h1>
                  <p>With this mail we would like to let you know that <span style='font-weight: bolder'>${thisOrder.business.name}</span> has <span style='font-weight: bolder'>${thisOrder.status}</span> your Order.</p>
                  <div>
                      <div>
                          <div>
                              <hr/>
                              <h3>Details <span style='padding-left:10px'>Order ${ordNum.slice(10).toUpperCase()}</span></h3>
                              <p style='font-size:0.95em; font-weight:bolder'>Business: ${thisOrder.business.name}</p>
                              <div>
                                  ${orders}
                              </div>
                              <hr/>
                              <h3>Information</h3>
                              <p>Name: ${thisOrder.note.name} </p>
                              <p>Phone: ${thisOrder.note.phone}</p>
                              ${thisOrder.note.street && `<p>Address: ${thisOrder.note.street}</p>`}
                              ${thisOrder.note.note && `<p>Note: ${thisOrder.note.note}</p>`}
                              <p>Delivery Service: ${thisOrder.format}</p>
                              <hr/>
                              <p>Summary: <span style='font-weight: bolder'>${thisOrder.business.currency} ${thisOrder.summary.toFixed(2)}</span></p>
                              <p>Payment Method: <span style='font-weight: bolder'>${thisOrder.paymentMethod}</span></p>
                              <p>Order status: <span style='font-weight: bolder'>${thisOrder.status}</span> 
                              </p>
                              <hr/>
                              <p>We hope to see you again soon.</p>
                              <h3>Foodie.de</h3>
                          </div>
                      </div>
                  </div>
              </div>    
          </div>
      </div>
      `
      };
  
      transporter.sendMail(mailStatusClient, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email Status to Client sent: ' + info.response);
          }
        });


        let mailStatusBusiness = {
          from: process.env.MAIL,
          to: business.address.email,
          subject: `You have ${thisOrder.status} Order ${ordNum.slice(10).toUpperCase()}`,
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
                      <h1 style='margin-top:3px'>Hi ${business.name},</h1>
                      <p>With this mail we would like to let you know that you have <span style='font-weight: bolder'>${thisOrder.status}</span> the order from  <span style='font-weight: bolder'>${thisOrder.user.name}</span>.</p>
                      <div>
                          <div>
                              <div>
                                  <hr/>
                                  <h3>Details <span style='padding-left:10px'>Order ${ordNum.slice(10).toUpperCase()}</span></h3>
                                  <p style='font-size:0.95em; font-weight:bolder'>User: ${thisOrder.user.username}</p>
                                  <div>
                                      ${orders}
                                  </div>
                                  <hr/>
                                  <h3>Information</h3>
                                  <p>Name: ${thisOrder.note.name} </p>
                                  <p>Phone: ${thisOrder.note.phone}</p>
                                  ${thisOrder.note.street && `<p>Address: ${thisOrder.note.street}</p>`}
                                  ${thisOrder.note.note && `<p>Note: ${thisOrder.note.note}</p>`}
                                  <p>Delivery Service: ${thisOrder.format}</p>
                                  <hr/>
                                  <p>Summary: <span style='font-weight: bolder'>${business.currency} ${thisOrder.summary.toFixed(2)}</span></p>
                                  <p>Payment Method: <span style='font-weight: bolder'>${thisOrder.paymentMethod}</span></p>
                                  <p>Order status: <span style='font-weight: bolder'>${thisOrder.status}</span> 
                                  </p>
                                  <hr/>
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

          transporter.sendMail(mailStatusBusiness, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email Order to Business sent: ' + info.response);
              }
            });


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
        const business = businessUpdated
        res.status(200).json(businessUpdated)
    })
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

module.exports = router;
