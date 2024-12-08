import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "@/components/theme-provider"; // Provider untuk pengaturan tema
import LayoutAuth from "./views/auth/layoutAuth"; // Layout untuk halaman otentikasi
import { Toaster } from "@/components/ui/sonner"; // Toast notification
import AuthMiddleware from "./services/authMiddleware"; // Middleware untuk otentikasi
import "./App.css"; // Import file CSS utama
import LayoutDashboard from "./views/dashboard/layoutDashboard"; // Layout untuk halaman dashboard

// Menentukan elemen root di HTML tempat React akan dipasang
const root = document.getElementById("root");

// Render aplikasi utama
ReactDOM.createRoot(root).render(
    <BrowserRouter>
        {" "}
        {/* Router untuk navigasi antar halaman */}
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {/* Pengaturan tema menggunakan ThemeProvider */}
            <Routes>
                {/* Rute untuk halaman otentikasi (Public Route) */}
                <Route path="/auth" element={<LayoutAuth />} />

                {/* Rute untuk halaman dashboard dengan middleware otentikasi */}
                <Route
                    path="/"
                    element={
                        <AuthMiddleware roles={["Employee", "Admin"]}>
                            {" "}
                            {/* Middleware untuk memeriksa otentikasi */}
                            <LayoutDashboard /> {/* Layout untuk halaman dashboard */}
                        </AuthMiddleware>
                    }
                />
            </Routes>
        </ThemeProvider>
        {/* Komponen untuk menampilkan notifikasi toast */}
        <Toaster />
    </BrowserRouter>
);
