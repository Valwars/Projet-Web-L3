const client = require('../database/mongo_connect');
const dbo = client.db('Sparkly');
const { ObjectId } = require('mongodb');
const path = require("path")
const fs = require('fs');
const NodeGeocoder = require('node-geocoder');



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
        nouveau.createdAt = new Date();
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
    const userId = req.query.userId; // Passez userId dans la requête
    console.log(req.query.currentIndex)
    try {
        // Dans swipe ne charger que : pdp, nom, prénom, localisation, description, interests.

        const projection = { _id: 1, pdp: 1, name: 1, firstname: 1, age: 1, description: 1, localisation: 1, interests: 1 };
        const limit = startIndex == 0 ? 20 : 10;
        const user = await dbo.collection('Admin').findOne({ _id: new ObjectId(userId) }); // Obtenez l'utilisateur actuel pour comparer les intérêts


        let orientationFilter = {};
        if (user.orientation === "Hétérosexuel") {
            orientationFilter = {
                orientation: "Hétérosexuel",
                sexe: user.sexe === "homme" ? "femme" : "homme"
            };
        } else if (user.orientation === "Homosexuel") {
            orientationFilter = {
                orientation: "Hétérosexuel",
                sexe: user.sexe
            };
        } else if (user.orientation === "Bisexuel") {
            orientationFilter = {
                $or: [
                    { orientation: "Hétérosexuel", sexe: user.sexe === "homme" ? "femme" : "homme" },
                    { orientation: "Homosexuel", sexe: user.sexe }
                ]
            };
        }

        const distanceInKm = 1000; // Spécifiez la distance maximale en kilomètres


        // Trouver les utilisateurs que l'utilisateur actuel n'a pas encore swipés
        const resultat = await dbo.collection('Admin').aggregate([{
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: user.locationPoint.coordinates
                    },
                    distanceField: "distance",
                    spherical: true,
                    maxDistance: distanceInKm * 1000, // Convertir la distance en mètres
                    query: {
                        _id: { $ne: new ObjectId(userId) },
                        name: { $ne: "" },
                        ...orientationFilter
                    }
                }
            },
            {
                $lookup: {
                    from: "Swipe",
                    let: { userId: "$_id" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$from", new ObjectId(userId)] },
                                    { $eq: ["$to", "$$userId"] }
                                ]
                            }
                        }
                    }],
                    as: "swipeData"
                }
            }, // Recherchez les swipes de l'utilisateur
            {
                $match: { "swipeData": { $eq: [] } }
            }, // Excluez les utilisateurs qui ont été swipés
            {
                $project: projection
            }, // Réappliquez la projection
            {
                $addFields: {
                    commonInterests: {
                        $size: {
                            $setIntersection: ["$interests", user.interests]
                        }
                    },
                    ageDifference: {
                        $abs: { $subtract: [{ $toInt: "$age" }, { $toInt: user.age }] }
                    }
                }
            },
            {
                $sort: { distance: -1, commonInterests: -1, ageDifference: 1 }
            }, // Trier par intérêts communs et différence d'âge
            {
                $skip: startIndex
            }, // Appliquez la pagination
            {
                $limit: limit
            } // Appliquez la limite
        ]).toArray();

        res.send(resultat);

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

    const { unid, searchString, order } = req.query

    const sortOrder = parseInt(order, 10) || 1;
    try {
        let dates = await dbo.collection('Dates').aggregate([{
                $match: {
                    $or: [{ premier: new ObjectId(unid) }, { second: new ObjectId(unid) }]
                }
            },
            {
                $lookup: {
                    from: 'Admin',
                    localField: 'premier',
                    foreignField: '_id',
                    as: 'premierData'
                }
            },
            {
                $lookup: {
                    from: 'Admin',
                    localField: 'second',
                    foreignField: '_id',
                    as: 'secondData'
                }
            },
            {
                $lookup: {
                    from: 'Admin',
                    let: { user1Id: '$premier', user2Id: '$second', userId: new ObjectId(unid) },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $ne: ['$_id', '$$userId'] },
                                    {
                                        $or: [
                                            { $eq: ['$_id', '$$user1Id'] },
                                            { $eq: ['$_id', '$$user2Id'] }
                                        ]
                                    }
                                ]
                            }
                        }
                    }],
                    as: 'adminData'
                }
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    localisation: 1,
                    activite: 1,
                    matchesData: {
                        $arrayElemAt: ['$adminData', 0]
                    }
                }
            },

            {
                $project: {
                    matchesData: {
                        name: 1,
                        firstname: 1,
                        pdp: 1,
                        _id: 1
                    },
                    date: 1,
                    localisation: 1,
                    activite: 1
                }
            }, {
                $sort: { date: sortOrder }
            },
        ]).toArray();

        console.log(dates)
        var tab = []
        dates.forEach(date => {
            tab.push({ _id: date._id, date: date.date, localisation: date.localisation, activite: date.activite, pdp: date.matchesData.pdp, name: date.matchesData.name, firstname: date.matchesData.firstname })
        });
        if (searchString) {
            tab = tab.filter(conversation => {
                var fullName = conversation.name + ' ' + conversation.firstname;

                return fullName.toLowerCase().includes(searchString.toLowerCase());
            });
        }
        res.json({ status: "ok", dates: tab });

    } catch (error) {
        next(error);
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
        const filetypes = /jpeg|jpg|png|gif|webp|PNG/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: File upload only supports the following filetypes - ' + filetypes);
    },
    limits: {
        fieldSize: 10 * 1024 * 1024, // 10 Mo (en octets)
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
    upload(req, res, async(error) => {
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

            console.log(req.files.photos)

            if (req.files && req.files.photos) {
                req.body.photos = req.files.photos.map(file => "/" + file.filename);
            }

            interests = interests.flat();

            req.body.interests = interests;

            console.log(req.files.pdp)
            if (req.files.pdp) {
                req.body.pdp = "/" + req.files.pdp[0].filename;

            }

            const optns = {
                provider: 'google',
                apiKey: 'AIzaSyC1p-dG6m6l-oTrsuCansySfat8R7N0yHs', // Remplacez par votre clé API Google
                formatter: null
            };


            const geocoder = NodeGeocoder(optns);

            // Utilisez geocoder pour convertir une adresse en coordonnées
            await geocoder.geocode(req.body.localisation)
                .then((res) => {
                    const coordinates = [res[0].longitude, res[0].latitude];
                    const location = {
                        type: "Point",
                        coordinates: coordinates
                    };

                    console.log(location)
                    req.body.locationPoint = location

                    console.log(req.body)
                })
                .catch((err) => {
                    return res.send({ status: 'error' });
                    console.log(err);
                });

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

                console.log("gere les files ")
                req.body.photos = req.files.photos.map(file => "/" + file.filename);

                let oldpic = Object.keys(req.body)
                    .filter((key) => key.startsWith('oldpic'))
                    .map((key) => req.body[key]);

                if (!Array.isArray(oldpic)) {
                    oldpic = [oldpic];
                }
                oldpic = oldpic.flat();

                console.log("OLD PICS : ")
                console.log(oldpic)
                let deleted = Object.keys(req.body)
                    .filter((key) => key.startsWith('deletedPics'))
                    .map((key) => req.body[key]);

                if (!Array.isArray(deleted)) {
                    deleted = [deleted];
                }

                deleted = deleted.flat();
                console.log("DELETED PICS : ")
                console.log(deleted)

                deleted.forEach(element => {
                    const filename = element.substring(1);
                    console.log("DELETE : ")
                    console.log(filename)
                    fs.unlink(path.join(__dirname, '../static', 'images', filename), err => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                });

                oldpic = oldpic.filter(item => !deleted.includes(item));

                console.log("OLD PICS : ")



                req.body.photos.push(...oldpic)
                console.log("FINALS PICS : ")
                console.log(req.body.photos)


            } else {

                let oldpic = Object.keys(req.body)
                    .filter((key) => key.startsWith('oldpic'))
                    .map((key) => req.body[key]);

                if (!Array.isArray(oldpic)) {
                    oldpic = [oldpic];
                }
                oldpic = oldpic.flat();

                console.log("OLD PICS : ")
                console.log(oldpic)

                let deleted = Object.keys(req.body)
                    .filter((key) => key.startsWith('deletedPics'))
                    .map((key) => req.body[key]);

                if (!Array.isArray(deleted)) {
                    deleted = [deleted];
                }

                deleted = deleted.flat();
                console.log("DELETED PICS : ")
                console.log(deleted)

                deleted.forEach(element => {
                    const filename = element.substring(1);
                    console.log("DELETE : ")
                    console.log(filename)
                    fs.unlink(path.join(__dirname, '../static', 'images', filename), err => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                });

                oldpic = oldpic.filter(item => !deleted.includes(item));
                req.body.photos = oldpic
                console.log("FINALS PICS : ")
                console.log(req.body.photos)

            }
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

            req.body.interests = interests;


            const optns = {
                provider: 'google',
                apiKey: 'AIzaSyC1p-dG6m6l-oTrsuCansySfat8R7N0yHs', // Remplacez par votre clé API Google
                formatter: null
            };


            const geocoder = NodeGeocoder(optns);

            // Utilisez geocoder pour convertir une adresse en coordonnées
            await geocoder.geocode(req.body.localisation)
                .then((res) => {
                    const coordinates = [res[0].longitude, res[0].latitude];
                    const location = {
                        type: "Point",
                        coordinates: coordinates
                    };

                    console.log(location)
                    req.body.locationPoint = location

                    console.log(req.body)
                })
                .catch((err) => {
                    return res.send({ status: 'error' });
                    console.log(err);
                });

            const update = {
                $set: {...req.body },

            };
            const options = { returnOriginal: false };
            const result = await collection.findOneAndUpdate(query, update, options);

            console.log(result)
            if (!result.value) {
                console.log("error")

                return res.json({ status: "error" });
            }

            console.log(result.value)
            if (req.files.pdp) {
                return res.json({ status: "ok", filename: "/" + req.body.pdp, pics: req.body.photos });

            }
            return res.json({ status: "ok", pics: req.body.photos });
        })
    } catch (err) {
        console.log(err);
        return res.json({ status: "error" });
    }
}


module.exports.addswipe = async(req, res, next) => {
    const { val, from, to, createdAt } = req.body;

    console.log(req.body)

    try {
        const swipe = { val: val, from: new ObjectId(from), to: new ObjectId(to), createdAt: createdAt };
        await dbo.collection('Swipe').insertOne(swipe);

        // Vérifier si un document swipe avec "to" égal à "from" existe
        const matchSwipe = await dbo.collection('Swipe').findOne({ from: new ObjectId(to), to: new ObjectId(from), val: "positif" });
        if (matchSwipe) {
            // Créer un document match dans une autre collection
            const match = { user1: new ObjectId(from), user2: new ObjectId(to), createdAt };

            const res = await dbo.collection('Matchs').insertOne(match);
            console.log(res)
        }

        res.json({ status: "ok" })
    } catch (error) {
        next(error);
    }
};

module.exports.matchs = async(req, res, next) => {
    //    console.log(req.query.currentuser)
    const val = req.query.currentuser;
    const { searchString, order } = req.query

    const sortOrder = parseInt(order, 10) || 1;
    try {
        let matches = await dbo.collection('Matchs').aggregate([{
                $match: {
                    $or: [{ user1: new ObjectId(val) }, { user2: new ObjectId(val) }]
                }
            },
            {
                $lookup: {
                    from: 'Admin',
                    let: { user1Id: '$user1', user2Id: '$user2' },
                    pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $ne: ['$_id', new ObjectId(val)] },
                                        {
                                            $or: [
                                                { $eq: ['$_id', '$$user1Id'] },
                                                { $eq: ['$_id', '$$user2Id'] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                firstname: 1,
                                pdp: 1,
                                _id: 1
                            }
                        }
                    ],
                    as: 'matchesData'
                }
            },
            {
                $project: {
                    matchesData: {
                        $arrayElemAt: ['$matchesData', 0]
                    }
                }
            },
            {
                $project: {
                    _id: '$matchesData._id',
                    name: '$matchesData.name',
                    firstname: '$matchesData.firstname',
                    pdp: '$matchesData.pdp'
                }
            },
            {
                $sort: { name: sortOrder }
            }
        ]).toArray();




        if (searchString) {
            matches = matches.filter(conversation => {
                const fullName = conversation.name + ' ' + conversation.firstname;
                return fullName.toLowerCase().includes(searchString.toLowerCase());
            });
        }

        res.json({ status: 'ok', match: matches });
    } catch (error) {
        next(error);
    }




}


module.exports.createDate = async(req, res) => {

    const { premier, second, date, localisation, activite, createdAt } = req.body;


    console.log(req.body.date);
    try {
        const admin = await dbo.collection("Dates").insertOne({
            premier: new ObjectId(premier),
            second: new ObjectId(second),
            date: date,
            localisation: localisation,
            activite: activite,
            createdAt: new Date()

        })

        if (!admin) return res.json({ status: "error" })
        res.json({ status: "ok" })
    } catch (error) {
        console.log(error)
    }
}

module.exports.createConv = async(req, res) => {
    console.log("NEW CONV OMG")



    try {
        const { user1, user2 } = req.body

        const adminCollection = await dbo.collection('Admin');
        const user1Data = await adminCollection.findOne({ _id: new ObjectId(user1) }, { projection: { pdp: 1, name: 1, firstname: 1 } });
        const user2Data = await adminCollection.findOne({ _id: new ObjectId(user2) }, { projection: { pdp: 1, name: 1, firstname: 1 } });

        if (!user1Data || !user2Data) return res.json({ status: "error", message: "User not found in Admin collection." });


        const collection = await dbo.collection('Conversations');

        const existingConv = await collection.findOne({
            $or: [
                { user1Id: new ObjectId(user1), user2Id: new ObjectId(user2) },
                { user1Id: new ObjectId(user2), user2Id: new ObjectId(user1) }
            ]
        });

        if (existingConv) return res.json({ status: "ok", message: "Conversation already exists." });

        const data = await collection.insertOne({
            user1Id: new ObjectId(user1),
            user2Id: new ObjectId(user2),
            meta1: { name: user1Data.name, firstName: user1Data.firstname, pdp: user1Data.pdp },
            meta2: { name: user2Data.name, firstName: user2Data.firstname, pdp: user2Data.pdp },
            createdAt: new Date()



        });

        if (!data) return res.json({ status: "error" });
        else return res.json({ status: "ok" });
    } catch (ex) {
        return res.json({ status: "error" });
    }


}

module.exports.getstat = async(req, res) => {
    const { userId, limit } = req.query;
    console.log(userId);
    console.log(limit);

    let sevenDaysAgo_swipe = new Date();
    sevenDaysAgo_swipe.setDate(sevenDaysAgo_swipe.getDate() - limit.limit_swipe);
    let sevenDaysAgo2_swipe = sevenDaysAgo_swipe.toISOString();

    let sevenDaysAgo_match = new Date();
    sevenDaysAgo_match.setDate(sevenDaysAgo_match.getDate() - limit.limit_match);
    let sevenDaysAgo2_match = sevenDaysAgo_match.toISOString();

    let sevenDaysAgo_conversation = new Date();
    sevenDaysAgo_conversation.setDate(sevenDaysAgo_conversation.getDate() - limit.limit_conversation);

    let sevenDaysAgo_date = new Date();
    sevenDaysAgo_date.setDate(sevenDaysAgo_date.getDate() - limit.limit_date);

    try {

        const dates = await dbo.collection('Dates').find({
            $or: [{
                premier: new ObjectId(userId)
            }, {
                second: new ObjectId(userId)
            }],
            createdAt: { $gte: sevenDaysAgo_date }

        }).toArray();

        let stats_dates = [];
        for (let i = 0; i < limit.limit_date; i++) {
            let date = new Date();
            date.setDate(date.getDate() - i);
            stats_dates.push({ createdAt: date, nombre_date: 0 });
        }
        for (let datee of dates) {
            let date = new Date(datee.createdAt);
            let index = stats_dates.findIndex(stat => stat.createdAt.toDateString() === date.toDateString());
            if (index !== -1) {
                stats_dates[index].nombre_date++;
            }
        }
        for (let stat_date of stats_dates) {
            let date = new Date(stat_date.createdAt);
            let day = String(date.getDate()).padStart(2, '0'); // ajoute un zéro devant si le jour est un chiffre seul
            let month = String(date.getMonth() + 1).padStart(2, '0'); // les mois en JavaScript commencent à 0
            stat_date.createdAt = day + '/' + month;
        }

        const swipe = await dbo.collection('Swipe').find({
            from: new ObjectId(userId),
            createdAt: { $gte: sevenDaysAgo2_swipe }
        }).sort({ createdAt: 1 }).toArray();

        let stats_swipes = [];
        for (let i = 0; i < limit.limit_swipe; i++) {
            let date = new Date();
            date.setDate(date.getDate() - i);
            stats_swipes.push({ createdAt: date, nombre_swipe: 0 });
        }
        for (let swipeItem of swipe) {
            let date = new Date(swipeItem.createdAt);
            let index = stats_swipes.findIndex(stat => stat.createdAt.toDateString() === date.toDateString());
            if (index !== -1) {
                stats_swipes[index].nombre_swipe++;
            }
        }
        for (let stat_swipe of stats_swipes) {
            let date = new Date(stat_swipe.createdAt);
            let day = String(date.getDate()).padStart(2, '0'); // ajoute un zéro devant si le jour est un chiffre seul
            let month = String(date.getMonth() + 1).padStart(2, '0'); // les mois en JavaScript commencent à 0
            stat_swipe.createdAt = day + '/' + month;
        }

        const matchs = await dbo.collection('Matchs').find({
            $or: [{
                user1: new ObjectId(userId)
            }, {
                user2: new ObjectId(userId)
            }],
            createdAt: { $gte: sevenDaysAgo2_match }

        }).toArray();

        let stats_matchs = [];
        for (let i = 0; i < limit.limit_match; i++) {
            let date = new Date();
            date.setDate(date.getDate() - i);
            stats_matchs.push({ createdAt: date, nombre_match: 0 });
        }
        for (let match of matchs) {
            let date = new Date(match.createdAt);
            let index = stats_matchs.findIndex(stat => stat.createdAt.toDateString() === date.toDateString());
            if (index !== -1) {
                stats_matchs[index].nombre_match++;
            }
        }
        for (let stat_match of stats_matchs) {
            let date = new Date(stat_match.createdAt);
            let day = String(date.getDate()).padStart(2, '0'); // ajoute un zéro devant si le jour est un chiffre seul
            let month = String(date.getMonth() + 1).padStart(2, '0'); // les mois en JavaScript commencent à 0
            stat_match.createdAt = day + '/' + month;
        }

        const conversations = await dbo.collection("Conversations").find({
            $or: [{
                user1Id: new ObjectId(userId)
            }, {
                user2Id: new ObjectId(userId)
            }],
            createdAt: { $gte: sevenDaysAgo_conversation }

        }).sort({ createdAt: 1 }).toArray();

        let stats_conversations = [];
        for (let i = 0; i < limit.limit_conversation; i++) {
            let date = new Date();
            date.setDate(date.getDate() - i);
            stats_conversations.push({ createdAt: date, nombre_conversation: 0 });
        }
        for (let conversation of conversations) {
            let date = new Date(conversation.createdAt);
            let index = stats_conversations.findIndex(stat => stat.createdAt.toDateString() === date.toDateString());
            if (index !== -1) {
                stats_conversations[index].nombre_conversation++;
            }
        }
        for (let stat_conversation of stats_conversations) {
            let date = new Date(stat_conversation.createdAt);
            let day = String(date.getDate()).padStart(2, '0'); // ajoute un zéro devant si le jour est un chiffre seul
            let month = String(date.getMonth() + 1).padStart(2, '0'); // les mois en JavaScript commencent à 0
            stat_conversation.createdAt = day + '/' + month;
        }

        stats_swipes.reverse();
        stats_matchs.reverse();
        stats_dates.reverse();
        stats_conversations.reverse();
        const resp = {
            status: "ok",
            stat_conversations: stats_conversations,
            stat_swipes: stats_swipes,
            stat_matchs: stats_matchs,
            stat_dates: stats_dates,

        }
        console.log(resp)


        // Renvoie les statistiques
        res.json(resp);


    } catch (error) {
        console.log(error)
    }
}