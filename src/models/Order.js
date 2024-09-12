const mongoose = require('mongoose');

let Order;

try {
    Order = mongoose.model('order');
} catch (error) {
    const { Schema } = mongoose;
    const orderSchema = new Schema({
        orderId: {
            type: Number
        },
        workdayId: {
            type: String
        },
        name: {
            type: String
        },
        orderName: {
            type: String
        },
        orderSize: {
            type: String
        },
		orderCost: {
			type: Number
		},
		status: {
			type: String
		},
        createdAt: {
            type: Date, default: Date.now
        },
        createdBy: {
            type: String
        },
        updatedAt: {
            type: Date
        },    
        updatedBy: {
            type: String
        }
    });

	orderSchema.pre('save', async function (next) {
		const doc = this;
		if (doc.isNew) {
		  const lastOrder = await Order.findOne({}, {}, { sort: { orderId: -1 } });
		  const nextOrderId = lastOrder ? lastOrder.orderId + 1 : 10000000; // Set initial orderId value here
		  doc.orderId = nextOrderId;
		}
		next();
	});

    orderSchema.set('toJSON', {
        transform: (doc, ret, options) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    Order = mongoose.model('order', orderSchema);
}

module.exports = Order;