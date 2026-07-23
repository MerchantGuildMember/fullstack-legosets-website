require("dotenv").config();

require("./config/db");
require("./config/keys");

const express = require("express");
const cors = require("cors");

const productRouter = require("./routes/products");
const userRouter = require("./routes/users");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", cartRouter);
app.use("/", orderRouter);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});