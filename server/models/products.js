const mongoose = require(`mongoose`)

let productsSchema = new mongoose.Schema(
    {
        images: {
            type: [String],
            required: true,
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "At least one image is required"
            }
        },
        name: {type: String, required: true},
        price: {type: Number, required: true},
        description: {type: String, required: false},
        stock: {type: Number, required: true},
        brand: {type: String, required: true},
        pieceCount: {type: Number, required: false},
        ratingCount: {type: Number, required: false, default: 0},
    },
    {
        collection: `products`,
        timestamps: true
    }
)

module.exports = mongoose.model('products', productsSchema)