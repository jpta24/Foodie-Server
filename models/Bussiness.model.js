const { Schema, model } = require('mongoose');

const businessSchema = new Schema(
	{
		name:String,
        address:{
            city:String,
            street:String,
            postCode:Number,
            country:String,
			telephone:String,
			email:String
        },
        format:{
			delivery:{
				delivery:Boolean,
				price:Number
			},
			pickup: Boolean,
			inplace: Boolean
		  },
		payment:{
			cash:{
				accepted:Boolean
			},
			card: {
				accepted:Boolean
			},
			pp: {
				accepted:Boolean,
				email:String
			},
			pagoMovil: {
				accepted:Boolean,
				ci:String
			},
			zelle: {
				accepted:Boolean,
				email:String
			}
		  },
        categories:[String],
		type:{
			prepared:Boolean,
			packed: Boolean,
			frozen: Boolean
		},
        logoUrl:String,
        bgUrl:String,
		owner:{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
        products:[
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
        pdfMenuUrl: String,
		currency: String,
        orders: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Order',
			},
		],
        employees:[
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		timesSaved:Number
		
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Business = model('Business', businessSchema);

module.exports = Business;