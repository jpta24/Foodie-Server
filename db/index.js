// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require('mongoose');

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/Foodie';

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MONGO_URI);
		console.log(
			`Connected to Mongo! Database name: "${conn.connections[0].name}"`
		);
	} catch (error) {
		console.log('Error connecting to mongo: ', error);
		process.exit(1);
	}
};

// mongoose
//   .connect(MONGO_URI)
//   .then((x) => {
//     console.log(
//       `Connected to Mongo! Database name: "${x.connections[0].name}"`
//     );
//   })
//   .catch((err) => {
//     console.error("Error connecting to mongo: ", err);
//   });

module.exports = connectDB;
