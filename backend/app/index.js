const express = require("express");
const cors = require("cors");
const app = express();
// Import koneksi database dan router untuk user dan leave request
const { connectDb } = require("./config/database");
const userRouter = require("./routes/user.Routes");
const leaveRequestRouter = require("./routes/leaveRequest.Routes");

// Konfigurasi CORS untuk membatasi akses hanya dari frontend yang ditentukan
// CORS digunakan untuk mengizinkan komunikasi antara frontend dan backend
app.use(
    cors({
        origin: process.env.FRONTEND_URI, // Izinkan hanya dari frontend yang berjalan
        methods: "GET,POST,PUT,DELETE", // Hanya metode HTTP ini yang diizinkan
        credentials: true, // Mengizinkan pengiriman cookie bersama dengan request
    })
);

// Middleware untuk mem-parsing JSON dan data URL-encoded
// Express akan mengonversi body request menjadi format JSON yang dapat diproses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inisialisasi koneksi database
// Menggunakan connectDb() untuk menyambungkan aplikasi ke database
connectDb();

// Menyusun router untuk user dan leave request
// Rute ini digunakan untuk mengelola data user dan leave request
app.use("/api/user", userRouter); // Rute untuk operasi terkait user (signup, login, dll.)
app.use("/api/request", leaveRequestRouter); // Rute untuk operasi terkait permintaan cuti

// Perbaikan route root
app.get("/", (req, res) => {
    // Perbaikan pada parameter callback function
    res.send("Hello World!");
});

// Mengekspor aplikasi Express untuk digunakan di file lain (misalnya untuk server)
module.exports = app;
