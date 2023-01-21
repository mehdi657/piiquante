const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");

router.post("/", auth, multer, sauceCtrl.createSauces);
router.put("/:id", auth, multer, sauceCtrl.modifySauces);
router.delete("/:id", auth, sauceCtrl.deleteSauces);
router.get("/:id", auth, sauceCtrl.getOneSauces);
router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/:id/like", auth, sauceCtrl.likeSauces);

module.exports = router;
