const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../middleware/multer-config");
const stuffCtrl = require("../controllers/stuff");

router.post("/", auth, multer, stuffCtrl.createSauces);
router.put("/:id", auth, multer, stuffCtrl.modifySauces);
router.delete("/:id", auth, stuffCtrl.deleteSauces);
router.get("/:id", auth, stuffCtrl.getOneSauces);
router.get("/", auth, stuffCtrl.getAllSauces);
router.post("/:id/like", auth, stuffCtrl.likeSauces);

module.exports = router;
