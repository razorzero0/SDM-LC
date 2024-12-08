"use client";

import { Button } from "@/components/ui/button"; // Mengimpor komponen Button untuk tombol
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"; // Mengimpor komponen form dari library UI untuk validasi form
import { Input } from "@/components/ui/input"; // Mengimpor komponen Input untuk kolom isian
import { Loader2 } from "lucide-react"; // Mengimpor ikon loader untuk status pemuatan
import { toast } from "sonner"; // Mengimpor toast untuk menampilkan notifikasi
import axios from "axios"; // Mengimpor axios untuk melakukan request HTTP

// Komponen Register untuk menangani pendaftaran pengguna baru
export default function Register({ loading, setLoading, form }) {
    // Fungsi untuk menangani pengiriman form registrasi
    const onSubmitRegister = async (value) => {
        const baseUrl = import.meta.env.VITE_API_URL;

        setLoading(true); // Mengatur status loading menjadi true saat form diproses
        try {
            // Mengirimkan request POST ke API untuk registrasi
            const response = await axios.post(baseUrl + "/api/user/signup", {
                username: value.username,
                password: value.password,
            });

            // Menampilkan notifikasi sukses setelah registrasi berhasil
            toast("Berhasil registrasi ✅", {
                description: "Akun anda berhasil dibuat", // Pesan deskripsi
                action: {
                    label: "tutup", // Tombol untuk menutup notifikasi
                    onClick: () => console.log("tutup"),
                },
            });
        } catch (error) {
            // Menangani error jika registrasi gagal
            console.error("Registrasi Gagal ❌", error);
            toast("Gagal registrasi ❌", {
                description: error.response.data.message, // Menampilkan pesan error dari response API
                action: {
                    label: "tutup", // Tombol untuk menutup notifikasi
                    onClick: () => console.log("tutup"),
                },
            });
        } finally {
            setLoading(0); // Menetapkan status loading kembali ke 0 setelah selesai
        }
    };

    return (
        <Form {...form}>
            {/* Form untuk registrasi */}
            <form onSubmit={form.handleSubmit(onSubmitRegister)} className="space-y-2">
                {/* Input untuk Username */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="masukkan username" {...field} />
                                {/* Kolom input untuk username */}
                            </FormControl>
                            <FormMessage /> {/* Menampilkan pesan error validasi */}
                        </FormItem>
                    )}
                />
                {/* Input untuk Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="masukkan password" {...field} />
                                {/* Kolom input untuk password */}
                            </FormControl>
                            <FormMessage /> {/* Menampilkan pesan error validasi */}
                        </FormItem>
                    )}
                />
                {/* Tombol submit */}
                <div className="flex justify-end">
                    {/* Menampilkan tombol loading atau tombol registrasi berdasarkan status loading */}
                    {loading ? (
                        <Button disabled>
                            <Loader2 className="animate-spin" /> {/* Ikon loader yang berputar */}
                            Please wait
                        </Button>
                    ) : (
                        <Button className="mt-3" type="submit">
                            Registrasi
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
