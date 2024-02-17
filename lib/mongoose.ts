import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");

  if (isConnected) {
    return console.log("Already connected to database");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "stackoverflow",
    });
    isConnected = true;
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
  }
};
