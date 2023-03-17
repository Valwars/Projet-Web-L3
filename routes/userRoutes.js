const {
    login,
    
} = require("../controllers/userController.js");


const router = require("express").Router();

router.post("/login", login)



module.exports = router;