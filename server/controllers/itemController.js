const { Item, ItemInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const { Sequelize } = require("sequelize");
const fs = require("fs").promises;

class ItemController {
  async create(req, res, next) {
    try {
      const { name, price, categoryId, info, code, quantity } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName), function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
      const item = await Item.create({
        name,
        price,
        categoryId,
        quantity,
        code,
        img: fileName,
      });
      console.log("🚀 ~ ItemController ~ create ~ item:", item.dataValues);

      if (info) {
        try {
          const parsedInfo = JSON.parse(info);
          parsedInfo.forEach((i) =>
            ItemInfo.create({
              title: i.title,
              description: i.description,
              itemId: item.id,
            }),
          );
        } catch (parseError) {
          return next(ApiError.badRequest("Invalid JSON format for info"));
        }
      }

      return res.json(item.dataValues);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { categoryId, limit, page } = req.query;
      page = page || 1;
      limit = limit || 24;
      let offset = page * limit - limit;
      let where = {};
      if (categoryId) {
        where.categoryId = categoryId;
      }
      const items = await Item.findAndCountAll({
        where: where,
        limit,
        offset,
      });

      return res.json(items);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
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
        if (await fs.access(imagePath, fs.constants.F_OK).catch(() => false)) {
          await fs.unlink(imagePath);
        }
        await Item.destroy({
          where: { id },
          include: [{ model: ItemInfo, as: "info" }],
        });
        return res.json({ message: "Товар успешно удален" });
      }
      throw new Error("Товар с указанным ID не найден");
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async search(req, res, next) {
    try {
      const { query } = req.query; // Получаем поисковый запрос из URL
      const items = await Item.findAndCountAll({
        where: {
          name: {
            [Sequelize.Op.iLike]: `%${query}%`, // Ищем по имени товара, нечувствительно к регистру
          },
        },
      });
      res.json(items);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      let updateData = {};
      const { name, price, categoryId, info, code, quantity } = req.body;

      let item = await Item.findOne({ where: { id } });

      if (!item) {
        throw new Error("Товар с указанным ID не найден");
      }

      if (req.files && req.files.img) {
        const { img } = req.files;
        let fileName = uuid.v4() + ".jpg";
        img.mv(
          path.resolve(__dirname, "..", "static", fileName),
          function (err) {
            if (err) {
              return res.status(500).send(err);
            }
          },
        );
        updateData.img = fileName;
      }

      if (name !== undefined) updateData.name = name;
      if (price !== undefined) updateData.price = price;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (quantity !== undefined) updateData.quantity = quantity;
      if (code !== undefined) updateData.code = code;

      await item.update(updateData);

      if (info) {
        await ItemInfo.destroy({ where: { itemId: id } });

        const parsedInfo = JSON.parse(info);
        parsedInfo.forEach((i) =>
          ItemInfo.create({
            title: i.title,
            description: i.description,
            itemId: id,
          }),
        );
      }

      return res.json(item.dataValues);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new ItemController();
