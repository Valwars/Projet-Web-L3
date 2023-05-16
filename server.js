let express = require('express')
require('dotenv').config()
let app = express()
const PORT = process.env.PORT || 7000

let bodyParser = require('body-parser');
const cors = require("cors");
const path = require("path")


const authRoutes = require("./routes/userRoutes");

const { url } = require('inspector');

app.use('/static/images', express.static('static/images'));
app.use(express.static('front/build'));

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());



app.use("/api/auth", authRoutes);


const socket = require("socket.io");


app.get("/*", (_, res) => {
    res.sendFile(path.join(__dirname + "/front/build/index.html"))
})



const server = app.listen(PORT, () => {
    console.log("serveur en écoute...")
    console.log(PORT)
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

async function findDocument(collectionName, fieldName, fieldValue) {
    const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/test"; // remplacez par votre propre uri
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const collection = client.db("test").collection(collectionName); // remplacez "test" par le nom de votre base de données
        const document = await collection.findOne({
            [fieldName]: fieldValue
        });

        console.log(document);
        return
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}


global.onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("SOCKET ON ")
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});