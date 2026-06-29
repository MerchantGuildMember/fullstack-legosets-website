const mongoose = require(`mongoose`)
const {Schema} = require("mongoose");

let ordersSchema = new mongoose.Schema(
    {
        userID: {type: Schema.Types.ObjectId, required: true},
        productID: {type: Schema.Types.ObjectId, required: true},
        amount: {type: Number, required: true},
        address: {type: String, required: true},
        total_price: {type: Number, required: true},
    },
    {
        collection: `orders`
    }
)

module.exports = mongoose.model('orders', ordersSchema)