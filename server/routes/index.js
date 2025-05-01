const exppress = require("express");
const router = exppress.Router();
const treeRouter = require("./treeRouter");
const userRouter = require("./userRouter");
const notificationRouter = require("./notificationRouter");
const appealRouter = require("./appealRouter");

router.use("/tree", treeRouter);
router.use("/user", userRouter);
router.use("/notification", notificationRouter);
router.use("/appeal", appealRouter);

module.exports = router;
