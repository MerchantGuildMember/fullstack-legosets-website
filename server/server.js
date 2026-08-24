require("dotenv").config();

require("./config/db");
require("./config/keys");

const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const User = require('./models/users');

const productRouter = require("./routes/products");
const userRouter = require("./routes/users");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/orders");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", cartRouter);
app.use("/", orderRouter);

app.use(notFound);
app.use(errorHandler);

async function seedAdmin() {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            parseInt(process.env.PASSWORD_SALT_ROUNDS)
        );

        await User.create({
            email: process.env.ADMIN_EMAIL,
            name: process.env.ADMIN_NAME || "Admin",
            password: hashedPassword,
            accessLevel: parseInt(process.env.ACCESS_LEVEL_ADMIN)
        });

        console.log("Admin account created");
    } else {
        console.log("Admin account already exists");
    }
}

seedAdmin();

app.listen(5000, () => {
    console.log("Server running on port 5000");
});