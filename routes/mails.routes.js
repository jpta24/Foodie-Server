const router = require('express').Router();
const nodemailer = require('nodemailer');

router.post('/webmessage', (req, res, next) => {
	const { nombre, correo, tel, mensaje } = req.body;
	// Send email confirmation create an account
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSMAIL,
		},
	});
	let mailCreateAccount = {
		from: process.env.EMAIL,
		to: 'mmoncada@antaresintrade.com',
		subject: 'Recibiste una Consulta en Antaresintrade.com',
		html: `
          <div style='background-image: linear-gradient(to right,#F1FAFF, #8EEDFF); width:85%; margin:auto'>
              <div>
                  <div style='padding:10px'>
                      <a href='https://antaresintrade.netlify.app/' style='display:flex; text-decoration: none'>
                          <img src='https://res.cloudinary.com/dwtnqtdcs/image/upload/v1692967580/antares/logo-antaresM_odftfk.png' width="60px" height="60px"/>
                          <h3 style='margin-left:15px'>Antares International Trade Corp</h3>
                      </a>
                  </div>
                  <div style='padding:10px'>
                      <h1 style='margin-top:3px'>Hola Miguel,</h1>
                      <p>Recibiste un mensaje desde tu pagina web con los siguientes datos: </p>
                      <div>
                            <hr/>
                            <p>De: ${nombre}</p>
                            <p>Teléfono: ${tel}</p>
                            <p>Correo: ${correo}</p>
                            <p>Mensaje:</p>
                            <p>${mensaje}</p>
                        </div>
                  </div>
              </div>
          </div>
          `,
	};

	transporter.sendMail(mailCreateAccount, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email Create Account sent: ' + info.response);
		}
	});

	// Send a json response containing the user object
	res.status(201).send({ message: 'Mensaje Enviado' });
});

router.post('/webfoddys', async (req, res, next) => {
	const { nombre, correo } = req.body;
	// Send email confirmation create an account
	const transporter = nodemailer.createTransport({
		// host: 'smtp.gmail.com',  // Servidor SMTP de Gmail
		// port: 587,              // Puerto SMTP seguro de Gmail
		// secure: false,          // Configurado en "false" porque no estás usando un puerto seguro directamente
		// auth: {
		// 	user: process.env.EMAILFOODYS,
		// 	pass: process.env.PASSFODDYS2,
		// },
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSMAIL,
		},
	});
	let mailCreateAccount = {
		from: 'info@foodys.app',
		to: correo,
		subject: 'New FOODYS User',
		html: `
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
          `,
	};

	// transporter.sendMail(mailCreateAccount, function (error, info) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else {
	// 		console.log('Email Create Account sent: ' + info.response);
	// 	}
	// });
	await new Promise((resolve, reject) => {
		transporter.sendMail(mailCreateAccount, (err, info) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				console.log('Email Create Account sent: ' + info.response);
				resolve(info);
			}
		});
	});

	// Send a json response containing the user object
	res.status(201).send({ message: 'Mensaje Enviado' });
});

module.exports = router;
