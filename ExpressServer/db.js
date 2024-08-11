import { connect } from &apos;mongoose&apos;
import dotenv from &apos;dotenv&apos;;
dotenv.config()


const connectDB = async () => {
    try {
      await connect(process.env.MONGODB_URI)
      console.log(&apos;MongoDB Connected...')
    } catch (err) {
      console.error(err.message)
      // Exit process with failure
      process.exit(1)
    }
  }

export default connectDB
