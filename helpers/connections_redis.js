const redis = require('redis');

const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1',
});

client.ping((err, pong) => {
    console.log(pong);
})

client.on('error', (err) => { console.log(err); });
client.on('connected', (err) => { console.log('connected'); });
client.on('ready', (err) => { console.log('ready'); });

module.exports = client;