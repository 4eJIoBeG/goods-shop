const { Category } = require("../models/models");
const ApiError = require("../error/ApiError");

class CategoryController {
  async create(req, res) {
    const { name } = req.body;
    const category = await Category.create({ name });
    return res.json(category);
  }
  async getAll(req, res) {
    const category = await Category.findAll();
    return res.json(category);
  }
  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      const category = await Category.findOne({
        where: { id },
      });
      return res.json(category);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new CategoryController();
