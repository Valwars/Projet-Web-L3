const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require("mongodb");
const url_db = 'mongodb+srv://valwars:0SBdCbgxuKaSw8Ta@l3-web.c0vkjhr.mongodb.net/?retryWrites=true&w=majority';



module.exports.login = async (req, res, next) => {
  const client = await MongoClient.connect(url_db);
  const dbo = client.db('Sparkly');
  try {
    const email = req.body.values.email;
    const password = req.body.values.password;
    const admin = await dbo.collection('Admin').findOne({ identifiant: email, mdp: password });

    if (!admin) {
      return res.json({ message: false });
    }

    res.send({ message: true, uti: admin });
  } catch (error) {
    next(error);;
  }
};


module.exports.register = async (req, res, next) => {
  console.log("register")
};


module.exports.swipe = async (req, res, next) => {
  const client = await MongoClient.connect(url_db);
  const dbo = client.db('Sparkly');
  try {
    const resultat = await dbo.collection('users').find({}).toArray();
    res.send(resultat);

  } catch (error) {
    next(error);;
  }

};


module.exports.dates = async (req, res, next) => {
  const client = await MongoClient.connect(url_db);
  const dbo = client.db('Sparkly');
 
  var unid = req.query.lid;
  try {

    const admin = await dbo.collection('Dates').findOne({ "": unid });

    if (!admin) {
      return res.json({ message: false });
    }
    console.log(admin)
    res.json({ message: true, uti: admin });
  } catch (error) {
    next(error);;
  }

}


module.exports.profil = async (req, res, next) => {
  const client = await MongoClient.connect(url_db);
  const dbo = client.db('Sparkly');
  console.log(req.query.myString);
  try {
    const theid = req.query.myString;
    const admin = await dbo.collection('users').findOne({ _id: new ObjectId(theid) });

    if (!admin) {
      return res.json({ message: false });
    }
    console.log(admin)
    res.send({ message: true, uti: admin });
  } catch (error) {
    next(error);;
  }
}