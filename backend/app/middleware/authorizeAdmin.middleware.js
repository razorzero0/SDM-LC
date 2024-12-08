/**
 * Middleware untuk memverifikasi apakah pengguna memiliki role "Admin".
 * Jika pengguna bukan admin, maka akses akan ditolak dengan status 403.
 *
 * @function
 * @param {Object} req - Objek request dari Express.
 * @param {Object} res - Objek response dari Express.
 * @param {Function} next - Fungsi untuk melanjutkan ke middleware berikutnya jika role pengguna valid.
 *
 * @returns {Object|void} - Mengembalikan response dengan status 403 jika akses ditolak,
 *                           atau melanjutkan ke middleware berikutnya jika pengguna adalah admin.
 */
module.exports = (req, res, next) => {
    if (req.userData.role !== "Admin") {
        return res.status(403).json({
            message: "Access Denied: Admins only",
        });
    }
    next();
};
