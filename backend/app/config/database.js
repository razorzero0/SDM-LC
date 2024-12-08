// Mengimpor library mongoose untuk mengelola koneksi dan operasi pada MongoDB
const mongoose = require("mongoose");

/**
 * Fungsi untuk menghubungkan aplikasi ke database MongoDB
 *
 * @async
 * @function connectDb
 * @returns {Promise<void>} - Mengembalikan promise yang menyatakan proses koneksi telah selesai
 *
 * Fungsi ini mencoba untuk menghubungkan ke database MongoDB menggunakan URI yang didefinisikan
 * di dalam variabel lingkungan `MONGO_URI`. Jika koneksi berhasil, akan mencetak pesan ke konsol.
 * Jika gagal, akan menangkap error dan mencetak pesan error ke konsol.
 */
exports.connectDb = async () => {
    try {
        // Mencoba untuk terhubung ke MongoDB menggunakan URI dari file .env
        await mongoose.connect(process.env.MONGO_URI);

        // Jika berhasil terhubung, cetak pesan ke konsol
        console.log("MongoDB connection Established...");
    } catch (error) {
        // Jika terjadi error selama proses koneksi, cetak pesan error ke konsol
        console.error("MongoDB connection failed: ", error.message);
    }
};
