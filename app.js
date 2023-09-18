const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config()

const app = express();

const PORT = config.get("port") || 3030

const mainRouter = require("./routes/index.routes.js");
const errorHandler = require('./middleware/error_handling_middleware.js');

process.on("uncaughtException", exception => {
  console.log("uncaughtException: ", exception.message);
})

process.on("unhandledRejection", rejection => {
  console.log("unhandledRejection", rejection);
})

app.use(express.json());
app.use(cookieParser());

app.use(mainRouter);

app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(config.get("dbURI"));

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (error) {
    console.log('Error on server!');
  }
}

start()