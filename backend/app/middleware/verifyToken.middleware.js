const jwt = require("jsonwebtoken");

/**
 * Middleware untuk memverifikasi token JWT dan menambahkan data pengguna ke request.
 * Middleware ini memeriksa header authorization untuk token yang valid,
 * mendekodekan token, dan menambahkan data pengguna ke `req.userData`.
 *
 * @function
 * @param {Object} req - Objek request Express yang berisi header authorization dengan token Bearer.
 * @param {Object} res - Objek response Express untuk mengirimkan response jika terjadi error.
 * @param {Function} next - Fungsi untuk melanjutkan ke middleware berikutnya jika token valid.
 * @returns {void}
 * @throws {Object} Mengembalikan status 401 jika token tidak valid atau terjadi kesalahan saat verifikasi.
 */
module.exports = (req, res, next) => {
    try {
        // Mengambil token dari header authorization dan menghapus "Bearer " bagian depannya
        const token = req.headers.authorization.replace("Bearer ", "");

        // Mendekodekan token menggunakan secret yang disimpan dalam environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Menyimpan data pengguna yang telah didekodekan dalam request untuk digunakan pada middleware berikutnya
        req.userData = decoded;

        // Melanjutkan ke middleware berikutnya jika token valid
        next();
    } catch (err) {
        // Mengembalikan error 401 jika verifikasi token gagal
        return res.status(401).json({
            message: "Authentification Failed",
        });
    }
};
