const { ObjectId } = require("mongodb");
const client = require('../database/mongo_connect');
module.exports.login = async (req, res, next) => {
  
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
  
  const dbo = client.db('Sparkly');
  try {
    const resultat = await dbo.collection('users').find({}).toArray();
    res.send(resultat);

  } catch (error) {
    next(error);;
  }

};


module.exports.dates = async (req, res, next) => {
  
  const dbo = client.db('Sparkly');
 
  var unid = req.query.lid;
  try {

    const admin = await dbo.collection('Dates').findOne({ "": unid });    
    if (!admin) {
      return res.json({ message: false });
    }
    const premier = await dbo.collection('Admin').findOne({ _id: new ObjectId(admin.premier) });
    const second = await dbo.collection('Admin').findOne({_id: new ObjectId(admin.second) });

    if(!premier || !second){
      console.log("le date n'existe pas");
      return res.json({ message: false });
    }
    console.log(admin);
    console.log(premier);

    res.json({ message: true , premier : premier , second : second});
  } catch (error) {
    next(error);;
  }

}


module.exports.profil = async (req, res, next) => {
  
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