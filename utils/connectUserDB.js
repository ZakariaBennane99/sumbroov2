import { connect } from 'mongoose';

const connectDB = async () => {

  console.log('Inside the connectDB')
    try {
      await connect(process.env.MONGODB_URI)
      console.log('MongoDB Connected...')
    } catch (err) {
      console.log('THE ERR FROM MONGO CONNECTING...', err)
      console.error(err.message)
      // Exit process with failure
      process.exit(1)
    }
}

module.exports = connectDB;
