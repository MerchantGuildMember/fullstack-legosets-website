const fs = require('fs')
const path = require('path')

const privateKey = fs.readFileSync(path.join(__dirname, '..', 'keys', 'private.pem'))
const publicKey = fs.readFileSync(path.join(__dirname, '..', 'keys', 'public.pem'))

module.exports = { privateKey, publicKey }