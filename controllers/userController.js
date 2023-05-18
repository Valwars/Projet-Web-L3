const client = require('../database/mongo_connect');
const dbo = client.db('Sparkly');
const { ObjectId } = require('mongodb');
const path = require("path")
const fs = require('fs');

module.exports.login = async(req, res, next) => {

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


module.exports.getUser = async(req, res) => {
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

module.exports.register = async(req, res, next) => {
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


module.exports.swipe = async(req, res, next) => {
    console.log("CURRENT INDEX")
    const startIndex = parseInt(req.query.currentIndex);
    console.log(req.query.currentIndex)
        // var startIndex = 0;
    try {
        // Dans swipe ne charger que : pdp, nom, prénom, localisation, description.

        if (startIndex == 0) {
            const resultat = await dbo.collection('Admin').find({}, { projection: { _id: 1, pdp: 1, name: 1, firstname: 1, age: 1, description: 1, localisation: 1 } }).skip(startIndex).limit(20).toArray();

            res.send(resultat);
        } else {
            const resultat = await dbo.collection('Admin').find({}, { projection: { _id: 1, pdp: 1, name: 1, firstname: 1, age: 1, description: 1, localisation: 1 } }).skip(startIndex).limit(10).toArray();

            res.send(resultat);
        }


    } catch (error) {
        next(error);;
    }

};


module.exports.getconv = async(req, res) => {

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


module.exports.dates = async(req, res, next) => {

    let unid = req.query.lid;
    try {
        const key1 = "premier";
        const key2 = "second";

        let tab = [];
        console.log(unid)
        const admin = await dbo.collection('Dates').find({
            $or: [{
                [key1]: unid
            }, {
                [key2]: unid
            }]
        }).toArray();
        if (!admin) {
            return res.json({ status: "error" });
        } else
        // console.log("admin : ")
        // console.log(admin)
            for (var i = 0; i < admin.length; i++) {
                if (admin[i].premier === unid) {
                    // Exécuter la requête correspondante à la clé 1
                    const info = await dbo.collection('Admin').findOne({ _id: new ObjectId(admin[i].second) }, { projection: { pdp: 1, name: 1, firstname: 1 } })
                        //   console.log("key1")
                        //   console.log(admin[i].premier)
                        //   console.log(key1)
                        //   console.log(info)
                    tab.push({
                        _id: info._id,
                        pdp: info.pdp,
                        name: info.name,
                        firstname: info.firstname,
                        localisation: admin[i].localisation,
                        date: admin[i].date
                    })
                } else if (admin[i].second === unid) {
                    // Exécuter la requête correspondante à la clé 2
                    const info = await dbo.collection('Admin').findOne({ _id: new ObjectId(admin[i].premier) }, { projection: { pdp: 1, name: 1, firstname: 1 } })
                        // console.log("key2")
                        // console.log(info)
                    tab.push({
                        _id: info._id,
                        pdp: info.pdp,
                        name: info.name,
                        firstname: info.firstname,
                        localisation: admin[i].localisation,
                        date: admin[i].date
                    })
                }
            }
            // console.log("tab :")
            //  console.log(tab)

        res.json({ status: "ok", dates: tab });

    } catch (error) {
        next(error);;
    }

}




module.exports.profil = async(req, res, next) => {

    console.log(req.query.myString);
    try {
        const theid = req.query.myString;
        const admin = await dbo.collection('Admin').findOne({ _id: new ObjectId(theid) });

        if (!admin) {
            return res.json({ status: "error" });
        }
        console.log(admin)
        res.send({ status: "ok", uti: admin });
    } catch (error) {
        next(error);;
    }
}


module.exports.getMessages = async(req, res, next) => {
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

module.exports.addMessage = async(req, res, next) => {
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


module.exports.filluser = async(req, res, next) => {
    console.log("filluser")
    console.log(req.body.values);
    // try {

    // } catch (ex) {
    //     next(ex)
    // }
}


const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './static/images');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

/*
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: File upload only supports the following filetypes - ' + filetypes);
    },
}).single('pdp'); */

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: File upload only supports the following filetypes - ' + filetypes);
    },
}).fields([{ name: 'photos', maxCount: 10 }, { name: 'pdp', maxCount: 1 }]); // Use fields() instead of array()


const upload2 = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp|PNG/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File upload only supports the following filetypes - ' + filetypes));
    },
    limits: {
        fieldSize: 10 * 1024 * 1024, // 10 Mo (en octets)
    },
}).array('files', 10); // Specify the maximum number of files allowed (e.g., 5)

module.exports.fillForm = (req, res) => {
    upload2(req, res, async(error) => {
        try {
            if (error instanceof multer.MulterError) {
                console.log(error)
                return res.send({ status: 'error', error: error.message });
            } else if (error) {
                // Handle other errors                
                console.log(error)

                return res.send({ status: 'error', error: error.message });
            }

            const { values } = req.body;

            const collection = await dbo.collection('Admin');

            const query = { _id: new ObjectId(req.body.id) };

            let interests = Object.keys(req.body)
                .filter((key) => key.startsWith('interests'))
                .map((key) => req.body[key]);

            let fileNames = [];
            if (req.files && req.files.length > 0) {
                fileNames = req.files.map((file) => '/' + file.filename);
            }

            interests = interests.flat();
            fileNames = fileNames.flat();

            const pdp = fileNames.shift()

            req.body.interests = interests;
            req.body.photos = fileNames;
            req.body.pdp = pdp;
            const update = { $set: req.body };

            const options = { returnOriginal: false };
            const result = await collection.findOneAndUpdate(query, update, options);

            console.log(result);
            return res.send({ status: 'ok' });
        } catch (error) {
            // Handle errors
            console.log(error);

            return res.send({ status: 'error', error: error.message });
        }
    });
};

module.exports.modifuser = async(req, res) => {
    try {
        upload(req, res, async function(err) {
            console.log(err)

            if (err instanceof multer.MulterError) {
                console.log(err)

                return res.send({ status: 'error', error: err })
            } else if (err) {
                console.log(err)

                return res.send({ status: 'error', error: err })
            }

            const collection = await dbo.collection('Admin');

            const query = { _id: new ObjectId(req.body.id) };

            if (req.files && req.files.photos) {
                req.body.photos = req.files.photos.map(file => "/" + file.filename);
            }

            console.log(req.body.photos)
                // Vérifiez si req.file existe avant d'essayer d'accéder à filename
                // Récupérer l'administrateur actuel
            const currentAdmin = await collection.findOne(query);

            // Vérifiez si req.file existe avant d'essayer d'accéder à filename
            if (req.files.pdp) {
                req.body.pdp = "/" + req.files.pdp[0].filename;

                // Supprimer l'ancien fichier image
                if (currentAdmin.pdp) {
                    // Supprime le premier caractère ("/") de currentAdmin.pdp
                    const filename = currentAdmin.pdp.substring(1);
                    console.log(filename)
                    fs.unlink(path.join(__dirname, '../static', 'images', filename), err => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                }
            } else {
                // Supprime le champ pdp s'il n'existe pas
                delete req.body.pdp;
            }

            let interests = Object.keys(req.body)
                .filter(key => key.startsWith('interests'))
                .map(key => req.body[key]);


            interests = interests.flat();

            console.log("INTEREST : ")

            console.log(interests)
            req.body.interests = interests;
            const update = { $set: req.body };

            const options = { returnOriginal: false };
            const result = await collection.findOneAndUpdate(query, update, options);

            console.log(result)
            if (!result.value) {
                console.log("error")

                return res.json({ status: "error" });
            }

            console.log(result.value)
            if (req.files.pdp) {
                return res.json({ status: "ok", filename: "/" + req.body.pdp });

            }
            return res.json({ status: "ok" });
        })
    } catch (err) {
        console.log(err);
        return res.json({ status: "error" });
    }
}


module.exports.addswipe = async(req, res) => {
    try {
        const data = req.body.value;
        console.log(data.val === "positif")
        if(data.val === "positif"){
            const test = await dbo.collection('Swipe').findOne({to: data.from});
            
            if(!test){                
            const ajoutswipe = await dbo.collection('Swipe').insertOne(req.body.value);
            if(!ajoutswipe) return res.json({status : "error"})
            return res.json({status : "ok"})
            } else{
                console.log(test)
                const doc = {
                    user1 : data.user1,
                    user2 : data.user2,
                    createdAt : new Date()
                }
                const ajoutmatch = await dbo.collection('Matchs').insertOne()
                if(!ajoutmatch) return res.json({status : "error"})
               return res.json({status : "ok"})
            }
        } else if (data.val === "negatif"){
            const ajoutswipe = await dbo.collection('Swipe').insertOne(req.body.value);
            if (!ajoutswipe) return res.json({status : "error"})
            return res.json({status :"ok"})
        }
       

    } catch (err) {
        return res.json({status : "error"})
    }

}