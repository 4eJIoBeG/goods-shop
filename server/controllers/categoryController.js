const { Category } = require("../models/models");
const ApiError = require("../error/ApiError");

class CategoryController {
  async create(req, res) {
    try {
      const { name } = req.body;
      const category = await Category.create({ name });
      return res.json(category);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res) {
    try {
      const category = await Category.findAll();
      return res.json(category);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({
        where: { id },
      });
      return res.json(category);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ where: { id } });
      if (!category) {
        return next(ApiError.notFound("Категория не найдена"));
      }
      await category.destroy();
      return res.json({ message: "Категория успешно удалена" });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new CategoryController();
