const {
    login,
    profile,
    Dates
} = require("../controllers/userController.js");


const router = require("express").Router();

router.post("/login", login)

router.post("/profile",profile)

// router.post("")

module.exports = router;