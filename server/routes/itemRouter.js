const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), itemController.create);
router.get("/", itemController.getAll);
router.get("/search", itemController.search);
router.get("/:id", itemController.getOne);
router.delete("/:id", checkRole("ADMIN"), itemController.delete);

module.exports = router;
