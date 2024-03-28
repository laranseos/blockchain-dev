import mongoose from "mongoose";
import { DB_URL } from "./contant";


export const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("MongoDB connected.");
        
    } catch (error) {
        console.log("DB connecting failed.")
    }
}