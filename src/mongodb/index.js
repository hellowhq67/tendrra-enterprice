
import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://divineapparle:aAdCshm0LH5H4wuk@tendrra.ffykr.mongodb.net/");
    
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;