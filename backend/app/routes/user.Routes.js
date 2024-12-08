const express = require("express");
const { signUp, logIn, getAllUsers, deleteUser } = require("../controllers/userController"); // Mengimpor controller untuk user
const router = express.Router(); // Membuat router baru
const { authValidation } = require("../middleware/authValidation.middleware"); // Middleware untuk validasi input sign up dan login
const verifyToken = require("../middleware/verifyToken.middleware"); // Middleware untuk verifikasi token JWT
const roleAdmin = require("../middleware/authorizeAdmin.middleware"); // Middleware untuk otorisasi hanya bagi admin

// Rute untuk melakukan registrasi user baru dengan validasi input
router.post("/signup", authValidation, signUp);

// Rute untuk login user dengan validasi input
router.post("/login", authValidation, logIn);

// Rute untuk mendapatkan semua pengguna, hanya bisa diakses oleh admin yang telah terverifikasi tokennya
router.get("/all", verifyToken, roleAdmin, getAllUsers);

// Rute untuk menghapus user berdasarkan userId, hanya bisa diakses oleh admin yang telah terverifikasi tokennya
router.delete("/delete-user/:userId", verifyToken, roleAdmin, deleteUser);

// Mengeksport router agar dapat digunakan dalam file lain
module.exports = router;
