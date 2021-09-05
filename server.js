require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

//Connect to Database
connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));

//error handler
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is up and live on port ${PORT}`);
});

process.on("unhandledRejection", (error, promise) => {
  console.error(`Error logged : ${error}`);
  server.close(() => process.exit(1));
});
