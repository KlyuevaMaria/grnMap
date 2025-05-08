const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const { User } = require("./userModels");

const Tree = sequelize.define("tree", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  adress: { type: DataTypes.STRING, allowNull: false },
  owner: { type: DataTypes.STRING, allowNull: false },
  year_of_planting: { type: DataTypes.INTEGER, allowNull: false },
  height: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  diameter: { type: DataTypes.DECIMAL(4, 2), allowNull: false },
  number_of_barrels: { type: DataTypes.INTEGER, allowNull: false },
  crown_diameter: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
});

const Status = sequelize.define("status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status_name: { type: DataTypes.STRING, allowNull: false },
});

const Special_note = sequelize.define("special_note", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  note: { type: DataTypes.TEXT, allowNull: true },
});

const Environment = sequelize.define("environment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const Condition = sequelize.define("condition", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const Document = sequelize.define("document", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: true },

  treeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Photo = sequelize.define("photo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  treeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Tree.hasOne(Status);
// Status.belongsTo(Tree);

User.hasMany(Tree);
Tree.belongsTo(User);

Status.hasMany(Tree, { foreignKey: "statusId" });
Tree.belongsTo(Status, { foreignKey: "statusId" });

Special_note.hasMany(Tree, { foreignKey: "specialNoteId" });
Tree.belongsTo(Special_note, { foreignKey: "specialNoteId" });

Environment.hasMany(Tree, { foreignKey: "environmentId" });
Tree.belongsTo(Environment, { foreignKey: "environmentId" });

Condition.hasMany(Tree, { foreignKey: "conditionId" });
Tree.belongsTo(Condition, { foreignKey: "conditionId" });

// Document.hasMany(Tree);
// Tree.belongsTo(Document);

// Photo.hasMany(Tree);
// Tree.belongsTo(Photo);

Tree.hasMany(Photo, { foreignKey: "treeId" });
Photo.belongsTo(Tree, { foreignKey: "treeId" });

Tree.hasMany(Document, { foreignKey: "treeId" });
Document.belongsTo(Tree, { foreignKey: "treeId" });

module.exports = {
  Tree,
  Status,
  Special_note,
  Environment,
  Condition,
  Document,
  Photo,
};
