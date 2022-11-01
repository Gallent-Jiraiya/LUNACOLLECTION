import mongoose from 'mongoose'

const connectDB = async () => {
	try {
		const con = await mongoose.connect(process.env.MONGO_URI)
		console.log(`mongoDB connected:${con.connection.host}`.cyan.underline)
	} catch (error) {
		console.log(`Error:${error.message}`.trimEnd.underline.bold)
		process.exit(1)
	}
}
export default connectDB
