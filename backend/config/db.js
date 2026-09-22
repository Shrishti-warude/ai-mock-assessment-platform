const mongoose = require('mongoose');
const dns = require('node:dns');

// Solve querySrv ECONNREFUSED issue on Windows/local DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    }
    catch(error){
        console.error(`Error : ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;