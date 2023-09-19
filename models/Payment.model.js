const { Schema, model } = require('mongoose');

const paymentSchema = new Schema(
	{
		business: {
			type: Schema.Types.ObjectId,
			ref: 'Business',
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
        invoice:{
			type: Schema.Types.ObjectId,
			ref: 'Invoice',
		},
		order:{
			type: Schema.Types.ObjectId,
			ref: 'Order',
		},
		status: {
			type: String,
			enum: [, 'pending', 'payed', 'confirmed'],
		},
        paymentMethod: {
			type: String,
			enum: ['pp', 'card', 'cash', 'pagoMovil', 'zelle'],
		},
		summary: Number,
        paymentImg:String,
		paymentConfirmationMethed:{
			type:String,
			enum:['time','user']
		},
        paymentConfirmationDate: Date,
		refID:String,
		emailUsed:String,
		phoneUsed:String || Number,
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
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Payment = model('Payment', paymentSchema);

module.exports = Payment;
