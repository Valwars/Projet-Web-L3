const {
    login,
    swipe,
    dates,
    profil
} = require("../controllers/userController.js");


const router = require("express").Router();

router.post("/login", login)

router.get("/",swipe)

router.get("/dates", dates)

router.get("/profile", profil)

module.exports = router;