// Import library jwt-decode
import { jwtDecode } from "jwt-decode";

/**
 * getUserId Function
 *
 * Fungsi ini digunakan untuk mendapatkan `userId` dari token autentikasi yang disimpan di localStorage.
 * Jika token tidak ada, kadaluwarsa, atau tidak valid, fungsi akan mengembalikan `false`.
 *
 * @returns {string|boolean} - Mengembalikan userId jika token valid, atau `false` jika token tidak ditemukan atau tidak valid.
 */
export default function getUserId() {
    try {
        // Ambil token dari localStorage
        const token = localStorage.getItem("authToken");

        // Periksa apakah token ada
        if (!token) {
            return false; // Token tidak ditemukan
        }

        // Dekode token menggunakan jwtDecode untuk membaca data payload
        const decodedToken = jwtDecode(token);

        // Kembalikan userId yang terdapat dalam payload token
        return decodedToken.userId;
    } catch (error) {
        // Log error jika terjadi masalah dalam proses decoding token
        console.error("Error decoding JWT token:", error);
    }

    // Jika ada kesalahan atau token tidak valid, kembalikan false
    return false;
}
