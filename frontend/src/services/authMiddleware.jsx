// Import dependencies
import { Navigate } from "react-router"; // Untuk navigasi halaman jika user tidak memiliki akses.
import { jwtDecode } from "jwt-decode"; // Untuk mendekode token JWT dan membaca informasinya.

/**
 * AuthMiddleware Component
 *
 * Middleware untuk melindungi akses ke halaman tertentu berdasarkan autentikasi dan otorisasi.
 * Komponen ini memastikan pengguna memiliki token yang valid, token belum kadaluwarsa,
 * dan jika diperlukan, memiliki peran (role) yang sesuai untuk mengakses halaman.
 *
 * @param {React.ReactNode} children - Komponen anak (child) yang dilindungi middleware ini.
 * @param {Array} roles - (Opsional) Array peran yang diizinkan untuk mengakses halaman.
 *
 * @returns {React.ReactNode} - Jika memenuhi syarat, mengembalikan `children`,
 *                              jika tidak, diarahkan ke halaman login (/auth).
 */
export default function AuthMiddleware({ children, roles = [] }) {
    // Mengambil token dari localStorage
    const token = localStorage.getItem("authToken");

    // Jika token tidak ditemukan, arahkan pengguna ke halaman login
    if (!token) {
        return <Navigate to="/auth" replace="true" />;
    }

    try {
        // Mendekode token untuk membaca informasi di dalamnya
        const decodedToken = jwtDecode(token);

        // Mengecek apakah token sudah kadaluwarsa
        const currentTime = Date.now() / 1000; // Waktu saat ini dalam detik
        if (decodedToken.exp < currentTime) {
            // Hapus token yang kadaluwarsa dari localStorage
            localStorage.removeItem("authToken");
            // Arahkan pengguna ke halaman login
            return <Navigate to="/auth" replace="true" />;
        }

        // Mengecek apakah pengguna memiliki role yang sesuai
        if (roles.length > 0 && !roles.includes(decodedToken.role)) {
            // Jika role tidak sesuai, arahkan ke halaman login
            return <Navigate to="/auth" replace="true" />;
        }
    } catch (error) {
        // Jika terjadi kesalahan saat mendekode token, hapus token dan arahkan ke login
        localStorage.removeItem("authToken");
        return <Navigate to="/auth" replace="true" />;
    }

    // Jika semua pemeriksaan lolos, render children (halaman yang dilindungi)
    return children;
}
