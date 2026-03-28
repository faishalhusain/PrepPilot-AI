import mongoose from "mongoose";

const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DataBase Connected")
    } catch (error) {
        console.log(`DataBase errro ${error}`)
    }
}

export default connectDb