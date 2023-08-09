const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PRODUCT = sequelize.define(
  "products",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriptions: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    features: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    images: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    ratings: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    totalItems: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    availability: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    variants: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = PRODUCT;

// {
//   "product_id": "P12345",
//   "name": "Example Product",
//   "category": "Electronics",
//   "price": 599.99,
//   "currency": "USD",
//   "description": "This is an amazing example product with advanced features.",
//   "features": [
//     "High-definition display",
//     "Fast quad-core processor",
//     "16GB RAM",
//     "256GB SSD storage",
//     "Wireless connectivity",
//     "Built-in camera",
//     "Long-lasting battery"
//   ],
//   "images": [
//     "https://example.com/images/product-image1.jpg",
//     "https://example.com/images/product-image2.jpg",
//     "https://example.com/images/product-image3.jpg"
//   ],
//   "ratings": {
//     "average": 4.7,
//     "total_reviews": 245
//   },
//   "availability": true,
//   "variants": [
//     {
//       "variant_id": "V001",
//       "color": "Black",
//       "size": "Medium",
//       "stock": 50
//     },
//     {
//       "variant_id": "V002",
//       "color": "White",
//       "size": "Medium",
//       "stock": 20
//     },
//     {
//       "variant_id": "V003",
//       "color": "Silver",
//       "size": "Large",
//       "stock": 30
//     }
//   ],
//   "seller": {
//     "seller_id": "S5678",
//     "seller_name": "ElectroTech Inc.",
//     "seller_rating": 4.9
//   }
// }
