import mongoose from "mongoose";


const connect_db=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("MongooDB Connection Error",error)
        process.exit(1)
    }
}

export default connect_db
