const nodemailer = require('nodemailer');

async function sendMail(mailOptions) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSMAIL,
		},
	});

	await new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				console.log('Email Create Account sent: ' + info.response);
				resolve(info);
			}
		});
	});
}

module.exports = sendMail;
