const client = require('../database/mongo_connect');
const dbo = client.db('Sparkly');
const { ObjectId } = require('mongodb');

module.exports.login = async (req, res, next) => {

    console.log("LOGIN")

    try {
        const email = req.body.values.email;
        const password = req.body.values.password;
        const admin = await dbo.collection('Admin').findOne({ mail: email, mdp: password });


        if (!admin) {
            return res.json({ status: "error" });
        }
        // console.log(admin)

        res.send({ status: "ok", uti: admin });
    } catch (error) {
        console.log(error)
        return res.json({ status: "error" });
    }
};


module.exports.getUser = async (req, res) => {
    try {
        console.log("USER")

        const { identifiant } = req.query;

        const admin = await dbo.collection('Admin').findOne({ mail: identifiant });

        if (!admin) {
            return res.json({ status: "error" });
        }
        res.send({ status: "ok", uti: admin });
    } catch (error) {
        res.send({ status: "error" });
    }
}

module.exports.register = async (req, res, next) => {
    const nouveau = req.body.nouveau;
    try {
        const ajout = await dbo.collection('Admin').insertOne(nouveau);
        console.log("ajouté");
        console.log(ajout.insertedId);
        if (!ajout) return res.json({ status: "error" });
        else return res.json({ status: "ok", id: ajout.insertedId });
    } catch (error) {
        next(error);
    }
};


module.exports.swipe = async (req, res, next) => {
    console.log("CURRENT INDEX")
    const startIndex = parseInt(req.query.currentIndex);
    console.log(req.query.currentIndex)
    // var startIndex = 0;
    try {
        // Dans swipe ne charger que : pdp, nom, prénom, localisation, description.

        if (startIndex == 0) {
            const resultat = await dbo.collection('users').find({}, { projection: { _id: 1, pdp: 1, name: 1, fistname: 1, age: 1, description: 1, localisation: 1 } }).skip(startIndex).limit(20).toArray();

            res.send(resultat);
        } else {
            const resultat = await dbo.collection('users').find({}, { projection: { _id: 1, pdp: 1, name: 1, fistname: 1, age: 1, description: 1, localisation: 1 } }).skip(startIndex).limit(10).toArray();

            res.send(resultat);
        }


    } catch (error) {
        next(error);;
    }

};


module.exports.getconv = async (req, res) => {

    try {
        const { userid, searchString, order } = req.query
        const sortOrder = parseInt(order, 10) || 1;


        const conversations = await dbo.collection('Conversations').find({
            $or: [
                { user1Id: new ObjectId(userid) },
                { user2Id: new ObjectId(userid) }
            ]
        }).sort({ createdAt: sortOrder }).toArray();


        var mappedConversations = conversations.map((conversation) => {
            if (conversation.user1Id.toString() === userid) {
                return {
                    conversationId: conversation._id,
                    meta: conversation.meta2,
                    to: conversation.user2Id
                };
            } else {
                return {
                    conversationId: conversation._id,
                    meta: conversation.meta1,
                    to: conversation.user1Id

                };
            }
        });

        if (searchString) {
            mappedConversations = mappedConversations.filter(conversation => {
                var fullName = conversation.meta.name + ' ' + conversation.meta.firstName;
                var fullName2 = conversation.meta.firstName + ' ' + conversation.meta.name;



                return fullName.toLowerCase().includes(searchString.toLowerCase()) || fullName2.toLowerCase().includes(searchString.toLowerCase());
            });
        }


        res.send({ status: "ok", conversations: mappedConversations });

    } catch (error) {
        res.send({ status: "error" });
        console.log(error)

    }
}


module.exports.dates = async (req, res, next) => {


    let unid = req.query.lid;
    try {

        const admin = await dbo.collection('Dates').find({ "": unid }).toArray();
        if (!admin) {
            return res.json({ status: "error" });
        } else {
                let couple = []; 
            for (let i = 0; i < admin.length; i++) {
           
            couple.push({ premier: await dbo.collection('Admin').findOne({ _id: new ObjectId(admin[i].premier) }), second: await dbo.collection('Admin').findOne({ _id: new ObjectId(admin[i].second) }) });
        }
            console.log(couple[0])
            res.json({ status: "ok", dates: admin, couple : couple});
            // console.log(admin);
        
        }

        // let date = []
    

        
    } catch (error) {
        next(error);;
    }

}




module.exports.profil = async (req, res, next) => {

    console.log(req.query.myString);
    try {
        const theid = req.query.myString;
        const admin = await dbo.collection('users').findOne({ _id: new ObjectId(theid) });

        if (!admin) {
            return res.json({ status: "error" });
        }
        console.log(admin)
        res.send({ status: "ok", uti: admin });
    } catch (error) {
        next(error);;
    }
}


module.exports.getMessages = async (req, res, next) => {
    try {
        const { from, convId } = req.query;

        console.log(convId)


        const collection = await dbo.collection('Messages');
        const messages = await collection.find({
            convId: new ObjectId(convId)

        }).sort({ updatedAt: 1 }).toArray();

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.from.toString() === from,
                message: msg.msg,
            };
        });

        console.log("OK POUR LES MESSAGES")
        console.log(projectedMessages)

        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};

module.exports.addMessage = async (req, res, next) => {
    try {

        const { from, message, convId } = req.body;
        const collection = await dbo.collection('Messages');

        const data = await collection.insertOne({
            msg: message,
            from: new ObjectId(from),
            convId: new ObjectId(convId)
        });

        if (!data) return res.json({ status: "error" });
        else return res.json({ status: "ok" });
    } catch (ex) {
        next(ex);
    }
}


module.exports.filluser = async (req, res, next) => {
    console.log("filluser")
    console.log(req.body.values);
    // try {

    // } catch (ex) {
    //     next(ex)
    // }
}

module.exports.modifuser = async (req, res) => {
    const { values } = req.body;
    try {
        const collection = await dbo.collection('Admin');

        const query = { _id: new ObjectId(values.id) };
        const update = { $set: values };

        const options = { returnOriginal: false };
        const result = await collection.findOneAndUpdate(query, update, options);

        console.log(result)
        if (!result.value) {
            console.log("error")

            return res.json({ status: "error" });
        }

        console.log(result.value)
        return res.json({ status: "ok" });


    } catch (err) {
        console.log(err);
        return res.json({ status: "error" });

    }


}