const {
    login,
    swipe,
    dates,
    profil,
    register,
    getUser,
    getconv,
    getMessages,
    addMessage,

} = require("../controllers/userController.js");


const router = require("express").Router();

router.post("/login", login)

router.post("/register", register)

router.get("/", swipe)

router.get("/dates", dates)

router.get("/profile", profil)
router.get("/getmsg", getMessages)
router.post("/addmsg", addMessage)


router.get("/user", getUser)
router.get("/getconv", getconv)


module.exports = router;