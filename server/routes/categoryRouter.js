const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), categoryController.create);
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);
router.delete("/:id", categoryController.delete);

module.exports = router;
