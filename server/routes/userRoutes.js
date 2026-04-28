const router = require("express").Router();
const { getProfile, updateProfile } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
