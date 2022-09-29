const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
	{
        business:{
            type: Schema.Types.ObjectId,
            ref: 'Business',
        },
        user:{
            type: Schema.Types.ObjectId,
            ref: 'Business',
        },
        products:[
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
				},
				quantity: Number,
			},
		],
        status:{
			type: String,
			enum: ['pending','payed','cancelled'],
		},
        paymentMethod:{
			type: String,
			enum: ['PayPal','Credit Card','Cash'],
		},
        format:{
            type:String,
            enum:['delivery','in-place']
        }
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Order = model('Order', orderSchema);

module.exports = Order;