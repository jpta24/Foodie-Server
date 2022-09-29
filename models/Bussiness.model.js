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
            type:String,
            enum:['delivery','in-place']
        },
        categories:[String],
        logoUrl:String,
        bgUrl:String,
        fooding:[String],
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