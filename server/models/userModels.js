const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  surname: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: "USER" },
  // Добавляем поля для подтверждения email
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  emailToken: { type: DataTypes.STRING, allowNull: true },
});

const Notification = sequelize.define("notification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Appeal = sequelize.define("appeal", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["received", "processing", "resolved"],
    defaultValue: "received",
    allowNull: false,
  },
});

const Response = sequelize.define("response", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
});

User.hasMany(Notification);
Notification.belongsTo(User);

User.hasMany(Appeal);
Appeal.belongsTo(User);

User.hasMany(Response);
Response.belongsTo(User);

Appeal.hasOne(Response);
Response.belongsTo(Appeal);

module.exports = {
  User,
  Notification,
  Appeal,
  Response
};
