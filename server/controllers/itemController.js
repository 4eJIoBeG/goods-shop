const { Item, ItemInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const { json } = require("sequelize");
const fs = require("fs").promises;

class ItemController {
  async create(req, res, next) {
    try {
      const { name, price, categoryId, info, code, quantity } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const item = await Item.create({
        name,
        price,
        categoryId,
        quantity,
        code,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          ItemInfo.create({
            title: i.title,
            description: i.description,
            itemId: item.id,
          }),
        );
      }

      return res.json(item);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    let { categoryId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 24;
    let offset = page * limit - limit;
    let items;
    try {
      if (!categoryId) {
        items = await Item.findAndCountAll({ limit, offset });
      }
      if (categoryId) {
        items = await Item.findAndCountAll({
          where: { categoryId },
          limit,
          offset,
        });
      }

      return res.json(items);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      const item = await Item.findOne({
        where: { id },
        include: [{ model: ItemInfo, as: "info" }],
      });
      return res.json(item);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const item = await Item.findOne({
        where: { id },
        include: [{ model: ItemInfo, as: "info" }],
      });
      if (item) {
        const imagePath = path.resolve(
          __dirname,
          "..",
          "static",
          item.dataValues.img,
        );
        if (await fs.access(imagePath, fs.constants.F_OK)) {
          await fs.unlink(imagePath);
        }
        await Item.destroy({
          where: { id },
          include: [{ model: ItemInfo, as: "info" }],
        });
        return res.json({ message: "Deleted successfully" });
      }
      throw new Error("There is no item with this ID");
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new ItemController();
