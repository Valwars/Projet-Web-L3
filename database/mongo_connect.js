const MongoClient = require('mongodb').MongoClient;

const url_db = 'mongodb+srv://valwars:0SBdCbgxuKaSw8Ta@l3-web.c0vkjhr.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url_db);

client.connect((err) => {
    if (err) {
        console.log('Error connecting to MongoDB:', err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
})

module.exports = client;