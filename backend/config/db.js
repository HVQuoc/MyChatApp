const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const DBConnection = await mongoose.connect(
            process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log(`MongoDB connected: ${DBConnection.connection.host}`)
    } catch (error) {
        console.log(`Error connection Database: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB