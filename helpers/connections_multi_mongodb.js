const mongoose = require('mongoose');
require('dotenv').config();

function newConnection(uri) {
    const conn = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    conn.on('connected', () => {
        console.log('Connection to Mongodb is connected');
    })

    conn.on('disconnected', () => {
        console.log('Connection to Mongodb is disconnected');
    })

    conn.on('error', (error) => {
        console.log(`Connection to Mongodb is ${JSON.stringify(error)}`);
    })

    process.on('SIGINT', async () => {
        await conn.close();
        process.exit(0);
    })

    return conn;
}

//make connection to Mongodb

const userConnection = newConnection(process.env.URI_MONGODB_USER);
module.exports = userConnection;