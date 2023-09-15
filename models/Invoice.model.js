const { Schema, model } = require('mongoose');

const invoiceSchema = new Schema(
	{
		business: {
			type: Schema.Types.ObjectId,
			ref: 'Business',
		},
		concepts:[{
					type: Schema.Types.ObjectId,
					ref: 'Conpcept',
				}],
		status: {
			type: String,
			enum: ['notCreated', 'pending', 'payed', 'confirmed'],
		},
        paymentID: {
            type: Schema.Types.ObjectId,
            ref: 'Payment',
        },
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Invoice = model('Invoice', invoiceSchema);

module.exports = Invoice;
