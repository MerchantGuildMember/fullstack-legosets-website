require("dotenv").config();

require("./config/db");

const express = require("express");
const cors = require("cors");

const productRouter = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", productRouter);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});