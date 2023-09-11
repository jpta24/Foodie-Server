function newUser(user) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${user.username},</h1>
                    <p>Welcome to Foodys. </p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Thanks for signing up for a FREE account.  You can now create a Business to bring your clients to your online store or you can start buying at Foodyss businesses. </h3>
                                <p>If you didn't sign up for an account please ignore  this email.  Someone probably made a typo and entered your email address on accident.</p>
                                
                                <p>Thanks for using our service.</p>
                                <h3>Foodys</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	return mailText;
}

function newBusiness(userUpdated, name) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${userUpdated.username},</h1>
                    <p>Welcome to Foodys. </p>
                    <h3>You have created a business named: <span style='padding-left:10px'>${name}</span></h3>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Thanks for signing up for a FREE account.  You can now start setting up your Business account get your QR code and bring clients to your business. </h3>
                                <p>If you didn't sign up for an account please ignore  this email.  Someone probably made a typo and entered your email address on accident.</p>
                                
                                <p>Thanks for using our service.</p>
                                <h3>Foodys</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	return mailText;
}

function mailOrderClient(userUpdated, orders, thisOrder, ordNum) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${userUpdated.username},</h1>
                    <p>Thanks for your order with us. We will send you a confirmation when the business receives it.</p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Details 
                                    <span style='padding-left:10px'>Order ${ordNum
																			.slice(10)
																			.toUpperCase()}</span>
                                </h3>
                                <p style='font-size:0.95em; font-weight:bolder'>Business: ${
																	thisOrder.business.name
																}</p>
                                <div>${orders}</div>
                                <hr/>
                                <h3>Information</h3>
                                <p>Name: ${thisOrder.note.name} </p>
                                <p>Phone: ${thisOrder.note.phone}</p>
                                ${
																	thisOrder.note.street &&
																	`<p>Address: ${thisOrder.note.street}</p>`
																}
                                ${
																	thisOrder.note.note &&
																	`<p>Note: ${thisOrder.note.note}</p>`
																}
                                <p>Delivery Service: ${thisOrder.format}</p>
                                <hr/>
                                <p>Summary: 
                                    <span style='font-weight: bolder'>
                                        ${
																					thisOrder.business.currency
																				} ${thisOrder.summary.toFixed(2)}
                                    </span>
                                </p>
                                <p>Payment Method: <span style='font-weight: bolder'>${
																	thisOrder.paymentMethod
																}</span></p>
                                <p>Order status: 
                                    <span style='font-weight: bolder'>${
																			thisOrder.status
																		}</span> 
                                </p>
                                <hr/>
                                <p>We hope to see you again soon.</p>
                                <h3>Foodys</h3>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    `;
	return mailText;
}

function mailOrderBusiness(userUpdated, orders, thisOrder, ordNum) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${
											thisOrder.business.name
										},</h1>
                    <p>You have received an order, please check it and confirm it to let the client know everything is Ok. </p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Details 
                                    <span style='padding-left:10px'>Order ${ordNum
																			.slice(10)
																			.toUpperCase()}</span>
                                </h3>
                                <p style='font-size:0.95em; font-weight:bolder'>User: ${
																	userUpdated.username
																}</p>
                                <div>${orders}</div>
                                <hr/>
                                <h3>Information</h3>
                                <p>Name: ${thisOrder.note.name} </p>
                                <p>Phone: ${thisOrder.note.phone}</p>
                                ${
																	thisOrder.note.street &&
																	`<p>Address: ${thisOrder.note.street}</p>`
																}
                                ${
																	thisOrder.note.note &&
																	`<p>Note: ${thisOrder.note.note}</p>`
																}
                                <p>Delivery Service: ${thisOrder.format}</p>
                                <hr/>
                                <p>Summary: 
                                    <span style='font-weight: bolder'>
                                        ${
																					thisOrder.business.currency
																				} ${thisOrder.summary.toFixed(2)}
                                    </span>
                                </p>
                                <p>Payment Method: <span style='font-weight: bolder'>${
																	thisOrder.paymentMethod
																}</span></p>
                                <p>Order status: 
                                    <span style='font-weight: bolder'>${
																			thisOrder.status
																		}</span> 
                                </p>
                                <hr/>
                                <p>We hope to see you again soon.</p>
                                <h3>Foodys</h3>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    `;
	return mailText;
}

function mailStatusClient(thisOrder, ordNum) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${
											thisOrder.user.username
										},</h1>
                    <p>With this mail we would like to let you know that you have <span style='font-weight: bolder'>${thisOrder.status.toUpperCase()}</span> your order with <span style='font-weight: bolder'>${
		thisOrder.business.name
	}</span>.</p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Details <span style='padding-left:10px'>Order ${ordNum
																	.slice(10)
																	.toUpperCase()}</span></h3>
                                <p style='font-size:0.95em; font-weight:bolder'>Business: ${
																	thisOrder.business.name
																}</p>
                                <div>
                                    ${orders}
                                </div>
                                <hr/>
                                <h3>Information</h3>
                                <p>Name: ${thisOrder.note.name} </p>
                                <p>Phone: ${thisOrder.note.phone}</p>
                                ${
																	thisOrder.note.street &&
																	`<p>Address: ${thisOrder.note.street}</p>`
																}
                                ${
																	thisOrder.note.note &&
																	`<p>Note: ${thisOrder.note.note}</p>`
																}
                                <p>Delivery Service: ${thisOrder.format}</p>
                                <hr/>
                                <p>Summary: <span style='font-weight: bolder'>${
																	thisOrder.business.currency
																} ${thisOrder.summary.toFixed(2)}</span></p>
                                <p>Payment Method: <span style='font-weight: bolder'>${
																	thisOrder.paymentMethod
																}</span></p>
                                <p>Order status: <span style='font-weight: bolder'>${thisOrder.status.toUpperCase()}</span> 
                                </p>
                                <hr/>
                                <p>We hope to see you again soon.</p>
                                <h3>Foodys</h3>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    `;
	return mailText;
}

function mailStatusBusiness(thisOrder, ordNum) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${
											thisOrder.business.name
										},</h1>
                    <p>With this mail we would like to let you know that <span style='font-weight: bolder'>${
											thisOrder.user.username
										}</span> has <span style='font-weight: bolder'>${thisOrder.status.toUpperCase()}</span> the order.</p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Details <span style='padding-left:10px'>Order ${ordNum
																	.slice(10)
																	.toUpperCase()}</span></h3>
                                <p style='font-size:0.95em; font-weight:bolder'>User: ${
																	thisOrder.user.username
																}</p>
                                <div>
                                    ${orders}
                                </div>
                                <hr/>
                                <h3>Information</h3>
                                <p>Name: ${thisOrder.note.name} </p>
                                <p>Phone: ${thisOrder.note.phone}</p>
                                ${
																	thisOrder.note.street &&
																	`<p>Address: ${thisOrder.note.street}</p>`
																}
                                ${
																	thisOrder.note.note &&
																	`<p>Note: ${thisOrder.note.note}</p>`
																}
                                <p>Delivery Service: ${thisOrder.format}</p>
                                <hr/>
                                <p>Summary: <span style='font-weight: bolder'>${
																	thisOrder.business.currency
																} ${thisOrder.summary.toFixed(2)}</span></p>
                                <p>Payment Method: <span style='font-weight: bolder'>${
																	thisOrder.paymentMethod
																}</span></p>
                                <p>Order status: <span style='font-weight: bolder'>${thisOrder.status.toUpperCase()}</span> 
                                </p>
                                <hr/>
                                <p>Thanks for using our service.</p>
                                <h3>Foodys</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	return mailText;
}

function mailStatusClientBusiness(thisOrder, ordNum) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${
											thisOrder.user.username
										},</h1>
                    <p>With this mail we would like to let you know that <span style='font-weight: bolder'>${
											thisOrder.business.name
										}</span> has <span style='font-weight: bolder'>${thisOrder.status.toUpperCase()}</span> your Order.</p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Details <span style='padding-left:10px'>Order ${ordNum
																	.slice(10)
																	.toUpperCase()}</span></h3>
                                <p style='font-size:0.95em; font-weight:bolder'>Business: ${
																	thisOrder.business.name
																}</p>
                                <div>
                                    ${orders}
                                </div>
                                <hr/>
                                <h3>Information</h3>
                                <p>Name: ${thisOrder.note.name} </p>
                                <p>Phone: ${thisOrder.note.phone}</p>
                                ${
																	thisOrder.note.street &&
																	`<p>Address: ${thisOrder.note.street}</p>`
																}
                                ${
																	thisOrder.note.note &&
																	`<p>Note: ${thisOrder.note.note}</p>`
																}
                                <p>Delivery Service: ${thisOrder.format}</p>
                                <hr/>
                                <p>Summary: <span style='font-weight: bolder'>${
																	thisOrder.business.currency
																} ${thisOrder.summary.toFixed(2)}</span></p>
                                <p>Payment Method: <span style='font-weight: bolder'>${
																	thisOrder.paymentMethod
																}</span></p>
                                <p>Order status: <span style='font-weight: bolder'>${thisOrder.status.toUpperCase()}</span> 
                                </p>
                                <hr/>
                                <p>We hope to see you again soon.</p>
                                <h3>Foodys</h3>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    `;
	return mailText;
}

function mailStatusBusinessBusiness(thisOrder, ordNum) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${
											thisOrder.business.name
										},</h1>
                    <p>With this mail we would like to let you know that you have <span style='font-weight: bolder'>${thisOrder.status.toUpperCase()}</span> the order from  <span style='font-weight: bolder'>${
		thisOrder.user.username
	}</span>.</p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Details <span style='padding-left:10px'>Order ${ordNum
																	.slice(10)
																	.toUpperCase()}</span></h3>
                                <p style='font-size:0.95em; font-weight:bolder'>User: ${
																	thisOrder.user.username
																}</p>
                                <div>
                                    ${orders}
                                </div>
                                <hr/>
                                <h3>Information</h3>
                                <p>Name: ${thisOrder.note.name} </p>
                                <p>Phone: ${thisOrder.note.phone}</p>
                                ${
																	thisOrder.note.street &&
																	`<p>Address: ${thisOrder.note.street}</p>`
																}
                                ${
																	thisOrder.note.note &&
																	`<p>Note: ${thisOrder.note.note}</p>`
																}
                                <p>Delivery Service: ${thisOrder.format}</p>
                                <hr/>
                                <p>Summary: <span style='font-weight: bolder'>${
																	thisOrder.business.currency
																} ${thisOrder.summary.toFixed(2)}</span></p>
                                <p>Payment Method: <span style='font-weight: bolder'>${
																	thisOrder.paymentMethod
																}</span></p>
                                <p>Order status: <span style='font-weight: bolder'>${thisOrder.status.toUpperCase()}</span> 
                                </p>
                                <hr/>
                                <p>Thanks for using our service.</p>
                                <h3>Foodys</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	return mailText;
}

function infoNewUser(nombre,correo) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h3 style='margin-left:15px'>FOODYS</h3>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hola Jean,</h1>
                    <p>Hay un nuevo usuario en la APP</p>
                    <div>
                        <hr/>
                        <p>Nombre: ${nombre}
                        <p>Correo: ${correo}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
	return mailText;
}

function accountInactiveInvoicePayment(business,invoice) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${business.name},</h1>
                    <p>We do not have good news. </p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>We would like to inform you that your account with us is currently marked as inactive due to an outstanding invoice (Invoice Number: ${invoice}) that has not been paid.</h3>
                                <p>To reactivate your account and continue enjoying our services, please click on the following link to make the payment and bring your account up to date:</p>
                                <hr/>
                                <div>
                                    <button style='background-color: #0d6efd; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer' onclick='window.open('https://www.foodys.app/${business.name.split(' ').join('-')}/invoice/${invoice}', '_blank')'>Make Payment</button>
                                </div>
                                <hr/>                                
                                <p>Please note that your access to certain features and benefits may be restricted until the payment is successfully processed.</p>
                                <hr/>                                
                                <p>If you have any questions or need assistance with the payment process, please do not hesitate to contact our support team at info@foodys.app. We are here to help you resolve any concerns you may have.</p> 
                                <hr/>                                
                                <p>Thank you for choosing FOODYS APP. We value your continued partnership and look forward to serving you.</p>
                                <h3>Foodys</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	return mailText;
}

function notificationNewInvoice(business,invoice) {
    const invoiceNumber = (invoice._id+'').slice(10).toUpperCase()
    const amount = invoice.charge.map(elem =>elem.price).reduce((acc, val) => {
        return acc + val;
    })
    .toFixed(2);
    function formatDateToDDMMYYYY(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const year = date.getFullYear();
      
        return `${day}/${month}/${year}`;
      }

	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://www.foodys.app/' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodys</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${business.name},</h1>
                    <p>You are doing well.</p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>We would like to inform you that a new invoice (Invoice Number: ${invoiceNumber}) has been generated for your account.</h3>
                                <p>This invoice must be paid by the due date (${formatDateToDDMMYYYY(invoice.dateForPayment)})  to avoid any delays or disruptions to your business.</p>
                                <br/>
                                <p>Invoice Details:</p>
                                <p>- Invoice Number: ${invoiceNumber} </p>
                                <p>- Amount Due: ${amount}.</p>
                                <p>- Due Date: $${formatDateToDDMMYYYY(invoice.dateForPayment)}.</p>
                                <hr/>                                
                                <p>To ensure uninterrupted service and prevent any inconveniences, please click on the following link to make the payment:</p>
                                <br/> 
                                <div>
                                    <button style='background-color: #0d6efd; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer' onclick='window.open('https://www.foodys.app/${business.name.split(' ').join('-')}/invoice/${invoice._id}', '_blank')'>Make Payment</button>
                                </div>
                                <br/>                                
                                <p>We kindly request that you complete the payment before the due date mentioned above. If you have any questions or require assistance with the payment process, please do not hesitate to contact our support team at info@foodys.app. We are here to assist you with any concerns you may have.</p>
                                <hr/>                           
                                <p>Thank you for choosing FOODYS APP. We value your continued partnership and look forward to serving you.</p>
                                <h3>Foodys App</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	return mailText;
}

//AGREGAR NUEVA FUNCION Y RECORDAR EXPORTARLA

// Exportar ambas funciones
module.exports = {
	newUser,
	newBusiness,
	mailOrderClient,
	mailOrderBusiness,
	mailStatusClient,
	mailStatusBusiness,
	mailStatusClientBusiness,
	mailStatusBusinessBusiness,
    infoNewUser,
    accountInactiveInvoicePayment,
    notificationNewInvoice
};
