const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketItem = sequelize.define("basket_id", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Item = sequelize.define("item", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  category_name: { type: DataTypes.STRING, allowNull: true },
  img: { type: DataTypes.STRING, allowNull: false },
});

const Category = sequelize.define("category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const ItemInfo = sequelize.define("item_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketItem);
BasketItem.belongsTo(Basket);

Category.hasMany(Item);
Item.belongsTo(Category);

Item.hasMany(BasketItem);
BasketItem.belongsTo(Item);

Item.hasMany(ItemInfo, { as: "info" });
ItemInfo.belongsTo(Item);

module.exports = { User, Basket, BasketItem, Item, ItemInfo, Category };
