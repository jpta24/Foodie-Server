const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		username: String,
		password: String,
		email: String,
		avatarUrl: String,
		name: String,
		phone: Number || String,
		rol: {
			type: String,
			enum: ['developer', 'adminPending','admin', 'employee', 'employeePending', 'user'],
		},
		business:{
		type: Schema.Types.ObjectId,
		ref: 'Business',
		},
		savedBusiness: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Business',
			},
		],
		savedProducts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		orders: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Order',
			},
		],
		cart: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
				},
				quantity: Number,
			},
		]
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const User = model('User', userSchema);

module.exports = User;
