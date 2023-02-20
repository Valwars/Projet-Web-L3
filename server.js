let express = require('express')
require('dotenv').config()
let app = express()
const PORT = process.env.PORT || 7000

let bodyParser = require('body-parser');
const cors = require("cors");
const path = require("path")
require('./database/mongo_connect');


const authRoutes = require("./routes/userRoutes");

app.use('/static/images', express.static('static/images'));
app.use(express.static('front/build'));

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.get("/*", (_, res) => {
    res.sendFile(path.join(__dirname + "/front/build/index.html"))
})

const server = app.listen(PORT, () => {
    console.log("serveur en écoute...")
})