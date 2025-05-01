const express = require("express");
const notificationController = require("../controllers/notificationController");
const router = express.Router();
router.post("/", notificationController.createNotification);
router.get("/", notificationController.getAll);
module.exports = router;
