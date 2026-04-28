const router = require("express").Router();
const { addFood, getFoods, updateStatus, getDonorFoods, getReceiverHistory, deleteFood, getFoodById } = require("../controllers/foodController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/add",verifyToken, addFood);
router.get("/list", getFoods);
router.put("/update-status/:id", updateStatus);
router.get("/donor", verifyToken, getDonorFoods);
router.get("/receiver-history/:id", getReceiverHistory);
router.delete("/delete/:id", verifyToken, deleteFood);
router.get("/:id", getFoodById);


module.exports = router;
