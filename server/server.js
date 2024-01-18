const express = require("express");
const cors = require("cors");
const assert = require("assert");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload')

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

//declarig cors to avoid port blocking
app.use(cors());

//configure file
app.use(fileUpload({
  useTempFiles: true
}));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_PROD, { useNewUrlParser: true }, (err) => {
  if (err) assert.deepStrictEqual(err, null);
  console.log("mongo db connected successfully");
});

//configure express

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configure cookie

app.use(cookieParser());

//route settings
app.use(`/api/auth/`, require(`./route/userRoute`));
app.use(`/api/product`, require(`./route/imgRoute`));
app.use(`/api/`, require(`./route/productRoute`));

app.listen(PORT, () => {
  console.log(`server running on @ http://localhost:` + PORT);
});
