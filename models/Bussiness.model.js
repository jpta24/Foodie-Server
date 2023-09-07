const { Schema, model } = require('mongoose');

const businessSchema = new Schema(
	{
		name: String,
		address: {
			city: String,
			street: String,
			postCode: Number,
			country: String,
			telephone: String,
			email: String,
		},
		ssmm:{
			fb:String,
			ig:String,
			wa:String
		},
		format: {
			delivery: {
				delivery: Boolean,
				price: Number,
			},
			pickup: Boolean,
			inplace: Boolean,
		},
		payment: {
			cash: {
				accepted: Boolean,
			},
			card: {
				accepted: Boolean,
			},
			pp: {
				accepted: Boolean,
				email: String,
			},
			pagoMovil: {
				accepted: Boolean,
				ci: String,
			},
			zelle: {
				accepted: Boolean,
				email: String,
			},
		},
		categories: [String],
		type: {
			prepared: Boolean,
			packed: Boolean,
			frozen: Boolean,
		},
		description:String,
		logoUrl: String,
		bgUrl: String,
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		products: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		highlightedProducts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
				default: []
			},
		],
		pdfMenuUrl: String,
		membership: [{
			plan: {
				type: String,
				enum: ['trial', 'free', 'basic', 'premium','menu','web'],
			},
			usedTrial: Boolean,
			updated: Date,
			dateStart:Date,
			dateNextPayment:Date,
			price:Number,
			currency:String,
			invoiceNotified:Boolean,
			status: {
				type: String,
				enum: ['pending', 'payed','confirmed'],
			},
		}],
		isActive: Boolean,
		currency: String,
		orders: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Order',
			},
		],
		employees: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		timesSaved: Number,
		invoices:[{
			type: Schema.Types.ObjectId,
			ref:'Invoice'
		}]
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Business = model('Business', businessSchema);

module.exports = Business;
