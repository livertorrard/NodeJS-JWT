const mongoose = require('mongoose');
const conn = mongoose.createConnection('mongodb://localhost:27017/userJwt',{
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

module.exports = conn;