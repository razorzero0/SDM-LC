// Import library jwt-decode
import { jwtDecode } from "jwt-decode";

/**
 * isAdmin Function
 *
 * Fungsi ini digunakan untuk memeriksa apakah pengguna memiliki peran (role) "Admin"
 * berdasarkan token autentikasi yang disimpan di localStorage.
 * Jika token tidak ada, kadaluwarsa, atau tidak valid, fungsi akan mengembalikan `false`.
 *
 * @returns {boolean} - Mengembalikan `true` jika pengguna memiliki role "Admin",
 *                      atau `false` jika tidak ada token atau token tidak valid.
 */
export default function isAdmin() {
    try {
        // Ambil token dari localStorage
        const token = localStorage.getItem("authToken");

        // Periksa apakah token ada
        if (!token) {
            return false; // Token tidak ditemukan
        }

        // Dekode token menggunakan jwtDecode untuk membaca data payload
        const decodedToken = jwtDecode(token);

        // Periksa apakah role pengguna adalah "Admin"
        if (decodedToken.role === "Admin") {
            return true; // Pengguna adalah Admin
        }
    } catch (error) {
        // Log error jika terjadi masalah dalam proses decoding token
        console.error("Error decoding JWT token:", error);
    }

    // Jika ada kesalahan atau role tidak "Admin", kembalikan false
    return false;
}
