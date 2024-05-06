const mongoose = require('mongoose');

const connectToDataBase = async() => {
    try {
        await mongoose.connect(process.env.MONGO_DATABASE_URL);
        console.log("heyy");
    }
    catch (e) {
        await mongoose.disconnect();
        console.log('DB Connection Failed!');
    }
}

module.exports = {
    connectToDataBase
}