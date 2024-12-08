import Auth from "./auth"; // Mengimpor komponen Auth untuk menangani login dan registrasi
import { Card, CardTitle } from "@/components/ui/card"; // Mengimpor komponen Card dan CardTitle untuk desain UI

// Komponen LayoutAuth adalah layout khusus untuk halaman autentikasi (login & register)
export default function LayoutAuth() {
    return (
        // Container utama untuk layout, menggunakan grid dan full height viewport
        <div className="h-[100vh] grid place-items-center bg-slate-400">
            {/* Card sebagai kontainer untuk elemen-elemen autentikasi */}
            <Card className="p-2 py-5 md:p-5 md:py-8 md:w-[800px] grid gap-5 place-items-center">
                {/* Judul yang ditampilkan di atas formulir autentikasi */}
                <CardTitle className="text-2xl">SDM Language Center</CardTitle>
                {/* Memasukkan komponen Auth untuk menangani proses login dan registrasi */}
                <Auth />
            </Card>
        </div>
    );
}
