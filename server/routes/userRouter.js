const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/verify", userController.verifyEmail);
router.get("/fetch-current-user", userController.getUser);


module.exports = router;
