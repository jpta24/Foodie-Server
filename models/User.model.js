const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		username: String,
		password: String,
		email: String,
		avatarUrl: String,
		name: String,
		lang: String,
		phone: Number || String,
		rol: {
			type: String,
			enum: [
				'developer',
				'adminPending',
				'admin',
				'employee',
				'employeePending',
				'user',
			],
		},
		business: {
			type: Schema.Types.ObjectId,
			ref: 'Business',
		},
		visitedBusiness:[
			{
				type: Schema.Types.ObjectId,
				ref: 'Business',
				default: [],
			},
		],
		savedBusiness: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Business',
				default: [],
			},
		],
		savedProducts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
				default: [],
			},
		],
		orders: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Order',
				default: [],
			},
		],
		cart: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					default: [],
				},
				quantity: Number,
			},
		],
		isDark: Boolean,
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const User = model('User', userSchema);

module.exports = User;
