const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
	{
        business:{
            type: Schema.Types.ObjectId,
            ref: 'Business',
        },
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User',
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
			enum: ['pending','confirmed','cancelled'],
		},
		summary: Number,
        paymentMethod:{
			type: String,
			enum: ['pp','card','cash','pagoMovil','zelle'],
		},
        format:{
            type:String,
            enum:['delivery','inplace','pickup']
        },
		note:{
			name:String,
			street:String,
			note:String,
			phone: String || Number
		}
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

const Order = model('Order', orderSchema);

module.exports = Order;