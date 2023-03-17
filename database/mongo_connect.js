const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect("mongodb+srv://valwars:0SBdCbgxuKaSw8Ta@l3-web.c0vkjhr.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



   