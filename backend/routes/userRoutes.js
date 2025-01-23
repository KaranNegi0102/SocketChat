const express = require("express");
const router = express.Router();
const { registerController, loginController , getAllUsers} = require("../controllers/userController");

router.post("/register", registerController);
router.post("/login", loginController);
router.get('/get-users', getAllUsers);


module.exports = router;