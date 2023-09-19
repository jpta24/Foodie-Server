const { Schema, model } = require('mongoose');

const conceptSchema = new Schema(
	{
		business: {
			type: Schema.Types.ObjectId,
			ref: 'Business',
		},
		Invoice: {
			type: Schema.Types.ObjectId,
			ref: 'Invoice',
		},
		code: String,
		concept: String,
		description: String,
		orders: {
			payed: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Order',
				},
			],
			notPayed: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Order',
				},
			],
		},
		price: Number,
		status: {
			type: String,
			enum: ['notCreated', 'pending', 'payed', 'confirmed'],
		},
		dateForPayment: Date,
	},
	{
		versionKey: false,
		timestamps: true,
	}
);


const Concept = model('Concept', conceptSchema);

module.exports = Concept;