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
		from: process.env.MAIL,
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
	res.status(201).send({ message:'Mensaje Enviado' });
});

module.exports = router;
