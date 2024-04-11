const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), categoryController.create);
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);

module.exports = router;
