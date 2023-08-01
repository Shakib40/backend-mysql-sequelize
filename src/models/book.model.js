const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BOOK = sequelize.define(
  "books",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    total_books_left: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_available: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    descriptions: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    addedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = BOOK;
