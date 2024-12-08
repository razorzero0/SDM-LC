const { z } = require("zod");

/**
 * Skema validasi untuk permintaan cuti menggunakan Zod.
 * Validasi dilakukan pada request body untuk memastikan format tanggal yang benar
 * dan alasan cuti yang wajib diisi.
 *
 * @constant
 * @type {Object} LeaveRequestSchema
 * @property {Object} body - Validasi untuk data dalam request body.
 * @property {string} startDate - Harus berupa tanggal yang valid dalam format YYYY-MM-DD.
 * @property {string} endDate - Harus berupa tanggal yang valid dalam format YYYY-MM-DD.
 * @property {string} reason - Harus berupa string dan tidak boleh kosong.
 */
const LeaveRequestSchema = z.object({
    body: z.object({
        startDate: z.string().date("Start date must be a valid date"), // Validasi tanggal mulai cuti
        endDate: z.string().date("End date must be a valid date"), // Validasi tanggal akhir cuti
        reason: z.string().min(1, "Reason is required"), // Validasi alasan cuti
    }),
});

/**
 * Middleware untuk memvalidasi request menggunakan schema yang diberikan.
 * Middleware ini akan memeriksa body, query, dan params pada request
 * sesuai dengan schema yang telah didefinisikan.
 *
 * @function validate
 * @param {Object} schema - Schema Zod yang digunakan untuk memvalidasi request.
 * @returns {Function} Middleware Express yang memvalidasi request dan melanjutkan ke middleware berikutnya
 * atau mengembalikan error jika validasi gagal.
 */
const validate = (schema) => (req, res, next) => {
    try {
        // Memvalidasi body, query, dan params dari request menggunakan schema Zod
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        next(); // Melanjutkan ke middleware berikutnya jika validasi berhasil
    } catch (err) {
        // Mengembalikan error 400 jika validasi gagal
        return res.status(400).json({ errors: err.errors });
    }
};

// Ekspor middleware validasi
module.exports = {
    /**
     * Middleware validasi untuk permintaan cuti.
     * Middleware ini memvalidasi request body berdasarkan LeaveRequestSchema.
     *
     * @type {Function}
     */
    validateLeaveRequest: validate(LeaveRequestSchema),
};
