import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}
//flag
const connection: ConnectionObject = {}

const DBConnection = async function (): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected");
        return
    }
    try {
        const connectDB = await mongoose.connect(process.env.MONGODB_URI || '');
        //flag change
        connection.isConnected = connectDB.connections[0].readyState
        console.log("DB connected Successfuly");
    } catch (error) {
        process.exit(1);
        console.log("DB failed !!", error);
    }
}
export default DBConnection;