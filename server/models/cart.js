const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 }
}, { _id: false });

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', default: null },
    guestId: { type: String, default: null },
    items: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('cart', cartSchema);