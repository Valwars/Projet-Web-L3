const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require("mongodb");
const url_db = 'mongodb+srv://valwars:0SBdCbgxuKaSw8Ta@l3-web.c0vkjhr.mongodb.net/?retryWrites=true&w=majority';


module.exports.login = (req, res) => {
    console.log(req.body.values.email);
    console.log(req.body.values.password);
    MongoClient.connect(url_db, function (err, db) {
        if (err) throw err;
        const dbo = db.db("Sparkly");
        dbo.collection('Admin').findOne({ identifiant: req.body.values.email , mdp : req.body.values.password }, (err, admin) => {
          if (err) console.log(err);
          if (!admin) return res.json({ message: false });
            console.log("trouvé")
            res.send(admin);
            db.close();
      
        })
    
      })


};

