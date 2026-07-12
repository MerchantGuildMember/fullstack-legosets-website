const mongoose = require(`mongoose`)
const {Schema} = require("mongoose");

let ordersSchema = new mongoose.Schema(
    {
        userID: {type: Schema.Types.ObjectId, ref: 'users', required: true},
        productID: {type: Schema.Types.ObjectId, ref: 'legosets', required: true},
        amount: {type: Number, required: true},
        address: {type: String, required: true},
        total_price: {type: Number, required: true},
    },
    {
        collection: `orders`,
        timestamps: true
    }
)

module.exports = mongoose.model('orders', ordersSchema)