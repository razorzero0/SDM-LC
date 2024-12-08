const { z } = require("zod");

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
        return res.status(400).send(err.errors);
    }
};

/**
 * Schema untuk validasi autentikasi menggunakan Zod.
 * Dalam contoh ini hanya melakukan validasi pada request body.
 *
 * @constant
 * @type {Object} AuthSchema
 * @property {Object} body - Validasi untuk data dalam request body.
 * @property {string} username - Harus berupa string.
 * @property {string} password - Harus berupa string dengan panjang minimal 5 karakter.
 */
const AuthSchema = z.object({
    body: z.object({
        username: z.string(), // Username harus berupa string
        password: z.string().min(5), // Password harus berupa string dan minimal 5 karakter
    }),
});

module.exports = {
    /**
     * Middleware validasi autentikasi menggunakan schema yang telah didefinisikan.
     * Middleware ini memvalidasi request body berdasarkan AuthSchema.
     *
     * @type {Function}
     */
    authValidation: validate(AuthSchema),
};
