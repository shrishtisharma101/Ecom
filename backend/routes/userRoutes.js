const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  updateProfileImage,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUsers,
  deleteUser,
} = require("../controllers/userController");
const authenticateUser = require("../middleware/authMiddleware");
const profileImageUpload = require("../middleware/uploadMiddleware");

// ==================================================
// REGISTER
// ==================================================

router.post("/register", profileImageUpload, registerUser);

// ==================================================
// LOGIN
// ==================================================

router.post("/login", loginUser);

// ==================================================
// UPDATE PROFILE IMAGE
// ==================================================

router.put(
  "/profile-image",
  authenticateUser,
  profileImageUpload,
  updateProfileImage
);

// ==================================================
// FORGOT PASSWORD
// ==================================================

router.post("/forgot-password", forgotPassword);

// ==================================================
// VERIFY OTP
// ==================================================

router.post("/verify-otp", verifyOtp);

// ==================================================
// RESET PASSWORD
// ==================================================

router.post("/reset-password", resetPassword);

// ==================================================
// ADMIN - GET ALL USERS
// GET http://localhost:8000/api/users
// ==================================================

router.get("/", getUsers);

// ==================================================
// ADMIN - DELETE USER
// DELETE http://localhost:8000/api/users/:id
// ==================================================

router.delete("/:id", deleteUser);

module.exports = router;
