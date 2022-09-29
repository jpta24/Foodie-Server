const { Schema, model } = require('mongoose');

const productSchema = new Schema(
	{
		name:String,
        ingredients:[String],
        price:Number,
        mainImg:String,
        otherImg:[String],
        otherInfo:String,
        timesSaved:Number,
        timesOrdered:Number,
        business:{
            type: Schema.Types.ObjectId,
            ref: 'Business',
        },
        categories:[String],
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Product = model('Product', productSchema);

module.exports = Product;