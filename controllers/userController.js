const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require("mongodb");
const url_db = 'mongodb+srv://valwars:0SBdCbgxuKaSw8Ta@l3-web.c0vkjhr.mongodb.net/?retryWrites=true&w=majority';



module.exports.login = async(req, res, next) => {
const client =await  MongoClient.connect(url_db);
const dbo = client.db('Sparkly');
  try {
    const email = req.body.values.email;
    const password = req.body.values.password;
    const admin = await dbo.collection('Admin').findOne({ identifiant: email , mdp : password});

    if(!admin){
      return res.json({message : false});
    }

    res.send({ message: true, uti: admin });
  } catch (error) {
    next(error);;
  }
};

