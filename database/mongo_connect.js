const MongoClient = require('mongodb').MongoClient;

const url_db = '';//Mettre votre url mongo
const client = new MongoClient(url_db);

client.connect((err) => {
    if (err) {
        console.log('Error connecting to MongoDB:', err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
})

module.exports = client;