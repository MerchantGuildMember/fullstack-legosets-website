const mongoose = require(`mongoose`)
const { Schema } = require("mongoose");

let ordersSchema = new mongoose.Schema(
    {
        userID: { type: Schema.Types.ObjectId, ref: 'users', default: null },
        guestId: { type: String, default: null },
        productID: { type: Schema.Types.ObjectId, ref: 'products', required: true },
        amount: { type: Number, required: true },
        address: { type: String, required: true },
        total_price: { type: Number, required: true },
    },
    {
        collection: `orders`,
        timestamps: true
    }
)

ordersSchema.pre('validate', function (next) {
    if (!this.userID && !this.guestId) {
        return next(new Error('Order must have either a userID or a guestId'));
    }
    next();
});

module.exports = mongoose.model('orders', ordersSchema)