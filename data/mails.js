function newUser(user) {
	const mailText = `
        <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
            <div>
                <div style='padding:10px'>
                    <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodie</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${user.username},</h1>
                    <p>Welcome to Foodie. </p>
                    <div>
                        <div>
                            <div>
                                <hr/>
                                <h3>Thanks for signing up for a FREE account.  You can now create a Business to bring your clients to your online store or you can start buying at Foodies businesses. </h3>
                                <p>If you didn't sign up for an account please ignore  this email.  Someone probably made a typo and entered your email address on accident.</p>
                                
                                <p>Thanks for using our service.</p>
                                <h3>Foodie.de</h3>
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
                    <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodie</h1>
                    </a>
                </div>
                <div style='padding:10px'>
                    <h1 style='margin-top:3px'>Hi ${userUpdated.username},</h1>
                    <p>Welcome to Foodie. </p>
                    <h3>You have created a business named: <span style='padding-left:10px'>${name}</span></h3>
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
    `;
	return mailText;
}

function mailOrderClient(userUpdated, orders, thisOrder, ordNum) {
	const mailText = `
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
                                <h3>Foodie.de</h3>
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
                    <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodie</h1>
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
                                <h3>Foodie.de</h3>
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
                    <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodie</h1>
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
                                <h3>Foodie.de</h3>
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
                    <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodie</h1>
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
                                <h3>Foodie.de</h3>
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
                    <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodie</h1>
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
                                <h3>Foodie.de</h3>
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
                    <a href='https://foodie-de.netlify.app/dashboard' style='display:flex; text-decoration: none'>
                        <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1665012984/foodie-gallery/Imagen1_lpv17v.png' width="60px" height="60px"/>
                        <h1 style='margin-left:15px'>Foodie</h1>
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
                                <h3>Foodie.de</h3>
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
    infoNewUser
};
