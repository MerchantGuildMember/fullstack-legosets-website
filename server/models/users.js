const mongoose = require(`mongoose`)

let usersSchema = new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true, lowercase: true, trim: true},
        name: {type: String, required: true},
        password: {type: String, required: true},
        photo: {type: String, required: false},
        accessLevel: {type: Number, default:parseInt(process.env.ACCESS_LEVEL_NORMAL_USER)}
    },
    {
        collection: `users`,
        timestamps: true
    }
)

module.exports = mongoose.model('users', usersSchema)