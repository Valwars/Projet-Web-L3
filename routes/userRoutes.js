const {
    login,
    profile,
    dates
} = require("../controllers/userController.js");


const router = require("express").Router();

router.post("/login", login)

router.get("/profile",profile)

router.get("/dates", dates)

module.exports = router;