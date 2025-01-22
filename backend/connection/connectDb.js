const mongoose = require("mongoose");

require("dotenv").config();
const connectDB = async () =>{
  try{
    const connection = await mongoose.connect(process.env.MONGO_URl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB connected: ${connection.connection.host}`);
  }
  catch(err){
    console.log(err);
  }
}

module.exports = connectDB