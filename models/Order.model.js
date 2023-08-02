const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
	{
		business: {
			type: Schema.Types.ObjectId,
			ref: 'Business',
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
				},
				quantity: Number,
				price:Number
			},
		],
		details: {
			paymentImg: String,
			pp: {
				create_time: String,
				id: String,
				links: { type: Object },
				payer: {
					address: { country_code: String },
					email_address: String,
					name: { given_name: String, surname: String },
					payer_id: String,
				},
			},
			purchase_units: [
				{
					reference_id: String,
					amount: {
						currency_code: String,
						value: String,
					},
					payee: {
						email_address: String,
						merchant_id: String,
					},
					shipping: {
						name: {
							full_name: String,
						},
						address: {
							address_line_1: String,
							admin_area_2: String,
							admin_area_1: String,
							postal_code: String,
							country_code: String,
						},
					},
					payments: {
						captures: [
							{
								type: Object,
							},
						],
					},
				},
			],
			status: String,
			update_time: String,
		},
		status: {
			type: String,
			enum: ['pending', 'confirmed', 'cancelled', 'payed'],
		},
		summary: Number,
		paymentMethod: {
			type: String,
			enum: ['pp', 'card', 'cash', 'pagoMovil', 'zelle'],
		},
		format: {
			type: String,
			enum: ['delivery', 'inplace', 'pickup'],
		},
		note: {
			name: String,
			street: String,
			note: String,
			phone: String || Number,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Order = model('Order', orderSchema);

module.exports = Order;
