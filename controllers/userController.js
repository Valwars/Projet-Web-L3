const { ObjectId } = require("mongodb");
const client = require('../database/mongo_connect');
module.exports.login = async(req, res, next) => {

    const dbo = client.db('Sparkly');
    try {
        const email = req.body.values.email;
        const password = req.body.values.password;
        const admin = await dbo.collection('Admin').findOne({ identifiant: email, mdp: password });

        if (!admin) {
            return res.json({ message: false });
        }
        console.log(admin)
        res.send({ message: true, uti: admin });
    } catch (error) {
        next(error);;
    }
};


module.exports.getUser = async(req, res) => {
    try {
        console.log("USER")
        const dbo = client.db('Sparkly');

        const { identifiant } = req.query;

        const admin = await dbo.collection('Admin').findOne({ identifiant: identifiant });

        if (!admin) {
            return res.json({ message: false });
        }

        console.log(admin)
        res.send({ status: "ok", uti: admin });
    } catch (error) {
        next(error);;
    }
}

module.exports.register = async(req, res, next) => {
    console.log("register")
};


module.exports.swipe = async(req, res, next) => {

    const dbo = client.db('Sparkly');
    try {
        const resultat = await dbo.collection('users').find({}).toArray();
        res.send(resultat);

    } catch (error) {
        next(error);;
    }

};


module.exports.dates = async(req, res, next) => {

    const dbo = client.db('Sparkly');

    let unid = req.query.lid;
    try {

        const admin = await dbo.collection('Dates').find({ "": unid }).toArray();
        if (!admin) {
            return res.json({ message: false });
        }
        let date = []
        let couple = [];

        for (let i = 0; i < admin.length; i++) {
            date.push(admin[i]);
            couple.push({ premier: await dbo.collection('Admin').findOne({ _id: new ObjectId(admin[i].premier) }), second: await dbo.collection('Admin').findOne({ _id: new ObjectId(admin[i].second) }) });
        }


        res.json({ message: true, couple: couple, date: date });
    } catch (error) {
        next(error);;
    }

}


module.exports.profil = async(req, res, next) => {

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