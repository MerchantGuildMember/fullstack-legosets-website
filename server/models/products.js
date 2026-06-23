const mongoose = require(`mongoose`)

let productsSchema = new mongoose.Schema(
    {
        id: {type: Number, required: true},
        image: {type: Buffer, required: true},
        name: {type: String, required: true},
        price: {type: Number, required: true},
        description: {type: String, required: false},
        stock: {type: Number, required: true},
    },
    {
        collection: `products`
    }
)

module.exports = mongoose.model('products', productsSchema)