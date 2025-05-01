require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models/treeModels");
const router = require("./routes/index");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();

app.use(express.json());
// app.use(express.static(path.resolve(__dirname, "static")));
app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.use(fileUpload({}));
app.use("/api", cors(), router);

app.get("/", (req, res) => {
  res.status(200).json({ message: "server is running😍" });
});

const PORT = process.env.PORT;
const start = async () => {
  try {
    await sequelize.authenticate();
    // if (process.env.NODE_ENV === "development") {
    //   await sequelize.sync({ alter: true });
    //   console.log("✅ DB synced with { alter: true } (dev mode)");
    // } else {
    //   await sequelize.sync();
    //   console.log("✅ DB synced (prod mode)");
    // }
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`🚀Server is running on port - ${PORT}`);
    });
  } catch (e) {
    console.error("❌ Ошибка при запуске сервера:", e);
  }
};

// const crypto = require('crypto');
// const secret = crypto.randomBytes(32).toString('hex');
// console.log('------------KEY----',secret);

start();
