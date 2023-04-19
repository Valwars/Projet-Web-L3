const {
    login,
    swipe,
    dates,
    profil,
    register,
    getUser
} = require("../controllers/userController.js");


const router = require("express").Router();

router.post("/login", login)

router.post("/register", register)

router.get("/", swipe)

router.get("/dates", dates)

router.get("/profile", profil)

router.get("/user", getUser)


module.exports = router;