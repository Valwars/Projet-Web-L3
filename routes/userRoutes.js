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
    filluser,
    modifuser,
    fillForm,
    addswipe,
    matchs,
    createDate,
    createConv

} = require("../controllers/userController.js");


const router = require("express").Router();

router.post("/login", login)

router.post("/register", register)
router.post("/fill", filluser)
router.get("/", swipe)

router.get("/dates", dates)

router.get("/profile", profil)
router.get("/getmsg", getMessages)
router.post("/addmsg", addMessage)
router.post("/swipe", addswipe)
router.get("/match", matchs)
router.post("/createDate", createDate)
router.post("/createConv", createConv)

router.get("/user", getUser)
router.get("/getconv", getconv)

router.post("/save", modifuser)
router.post("/fillForm", fillForm)

module.exports = router;