const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Establishing connection with DatBase.....");
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB Connected!");
};

module.exports = connectDB;
