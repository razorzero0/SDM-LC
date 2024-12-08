const express = require("express");
const router = express.Router();
const {
    leaveRequest, // Menangani permintaan pengajuan cuti
    updateLeaveRequestStatus, // Menangani pembaruan status pengajuan cuti
    getAllLeaveRequests, // Mengambil semua data pengajuan cuti
    deleteLeaveRequest, // Menghapus pengajuan cuti berdasarkan ID
} = require("../controllers/leaveRequestController");
const { validateLeaveRequest } = require("../middleware/leaveValidation.middleware"); // Validasi pengajuan cuti
const verifyToken = require("../middleware/verifyToken.middleware"); // Middleware untuk verifikasi token JWT
const roleAdmin = require("../middleware/authorizeAdmin.middleware"); // Middleware untuk otorisasi admin

// Middleware group untuk rute leave request
// authMiddleware digunakan untuk rute yang membutuhkan verifikasi token dan validasi pengajuan cuti
const authMiddleware = [verifyToken, validateLeaveRequest];
// adminMiddleware digunakan untuk rute yang hanya boleh diakses oleh admin (memeriksa token)
const adminMiddleware = [verifyToken];

// Rute dengan middleware yang digabungkan
// POST: Membuat pengajuan cuti baru, membutuhkan verifikasi token dan validasi data pengajuan cuti
router.post("/leave-request", authMiddleware, leaveRequest);

// PUT: Mengupdate status pengajuan cuti, hanya dapat diakses oleh admin setelah verifikasi token
router.put("/update-leave-request", adminMiddleware, updateLeaveRequestStatus);

// GET: Mengambil semua pengajuan cuti, hanya dapat diakses oleh admin setelah verifikasi token
router.get("/all", adminMiddleware, getAllLeaveRequests);

// DELETE: Menghapus pengajuan cuti berdasarkan ID, hanya dapat diakses oleh admin setelah verifikasi token
router.delete("/delete-request/:requestId", adminMiddleware, deleteLeaveRequest);

// Mengeksport router agar dapat digunakan dalam file lain
module.exports = router;
