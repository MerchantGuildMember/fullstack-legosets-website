const mongoose = require(`mongoose`)

let usersSchema = new Mongoose.Schema(
    {
        id: {type: UUID, required: true},
        profilePicture: {type: Buffer, required: false},
        email: {type: String, required: true},
        password: {type: String, required: true},
        admin: {type: Boolean, default: false},
    },
    {
        collection: `users`
    }
)

module.exports = mongoose.model('users', usersSchema)