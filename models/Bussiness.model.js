const { Schema, model } = require('mongoose');

const businessSchema = new Schema(
	{
		name:String,
        address:{
            city:String,
            street:String,
            postCode:Number,
            country:String,
        },
        format:{
			delivery:Boolean,
			pickup: Boolean,
			inplace: Boolean
		  },
		payment:{
			cash:Boolean,
			card: Boolean,
			pp: Boolean,
			pagoMovil: Boolean,
			zelle: Boolean
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