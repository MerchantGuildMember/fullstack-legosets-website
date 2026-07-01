const mongoose = require(`mongoose`)

let usersSchema = new mongoose.Schema(
    {
        email: {type: String, required: true},
        password: {type: String, required: true},
        profilePicture: {type: Buffer, required: false},
        admin: {type: Boolean, default: false},
    },
    {
        collection: `users`
    }
)

module.exports = mongoose.model('users', usersSchema)