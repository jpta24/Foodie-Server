const { Schema, model } = require('mongoose');

const invoiceSchema = new Schema(
	{
		business: {
			type: Schema.Types.ObjectId,
			ref: 'Business',
		},
		charge: [
			{
				concept: String,
				description: String,
				price: Number,
			},
		],
		status: {
            type: String,
            enum: ['pending', 'payed','confirmed'],
        },
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Invoice = model('Invoice', invoiceSchema);

module.exports = Invoice;
