const { Schema, model } = require('mongoose');

const productSchema = new Schema(
	{
		name:String,
        ingredients:[String],
        price:Number,
        mainImg:String,
        otherImg:[String],
        description:String,
        type:String,
		weight:Number,
        timesSaved:Number,
        timesOrdered:Number,
        business:{
            type: Schema.Types.ObjectId,
            ref: 'Business',
        },
        categories:[String],
        status:String
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Product = model('Product', productSchema);

module.exports = Product;