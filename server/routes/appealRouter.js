const express = require("express");
const appealController = require("../controllers/appealController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const router = express.Router();

router.post("/create-appeal", authMiddleware, appealController.createAppeal);
router.get('/get-user-apeeals', authMiddleware, appealController.getUserAppeals);
router.get('/get-response-on-apeeal', authMiddleware, appealController.getResponseForUser);

router.get("/admin/get-apeeals", appealController.getAllAppeals);
router.post("/admin/reply/:appealId", checkRoleMiddleware('ADMIN'), appealController.createResponse);
router.get("/admin/get-responses", appealController.getAllResponses);

module.exports = router;
