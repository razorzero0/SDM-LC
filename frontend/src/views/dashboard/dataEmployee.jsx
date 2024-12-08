"use client";

// Mengimpor komponen-komponen UI yang digunakan untuk tabel, dialog, dan tombol
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

// Komponen utama untuk menampilkan data karyawan
export default function DataEmployee({ token }) {
    const baseUrl = import.meta.env.VITE_API_URL;

    // State untuk menyimpan daftar permintaan data karyawan
    const [requests, setRequests] = useState([]);

    // Fungsi untuk mengambil semua data karyawan
    const getAllRequest = async () => {
        try {
            // Mengambil data dari API dengan token otentikasi
            const response = await axios.get("http://localhost:4000/api/user/all", {
                headers: {
                    Authorization: `Bearer ${token}`, // Menambahkan token Bearer untuk otorisasi
                },
            });

            // Memfilter dan memformat data karyawan (mengabaikan role "Admin")
            const formattedRequests = response.data.users
                .filter((request) => request.role !== "Admin") // Hanya mengambil data dengan role selain "Admin"
                .map((request) => ({
                    id: request._id, // ID karyawan
                    username: request.username, // Nama pengguna karyawan
                }));

            // Menyimpan data yang sudah diformat ke dalam state
            setRequests(formattedRequests);
        } catch (error) {
            // Menangani error jika gagal mengambil data
            console.error("Gagal mengambil data", error);
        }
    };

    // Fungsi untuk menghapus akun karyawan
    const deleteUser = async (id) => {
        try {
            // Mengirimkan permintaan untuk menghapus akun berdasarkan ID
            const response = await axios.delete(baseUrl + `/api/user/delete-user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Menambahkan token Bearer untuk otorisasi
                },
            });

            // Menampilkan toast jika penghapusan berhasil
            toast("Proses Berhasil ✅", {
                description: "Berhasil hapus akun karyawan",
                action: {
                    label: "tutup", // Tombol untuk menutup pesan
                },
            });

            // Memanggil kembali fungsi untuk mengambil data terbaru setelah penghapusan
            await getAllRequest();
        } catch (error) {
            // Menangani error jika gagal menghapus data
            toast("Gagal hapus akun ❌", {
                description: error.response.data.message, // Menampilkan pesan error
                action: {
                    label: "Undo", // Tombol untuk membatalkan tindakan
                    onClick: () => console.log("Undo"),
                },
            });
        }
    };

    // Mengambil data permintaan karyawan saat komponen pertama kali dimuat
    useEffect(() => {
        getAllRequest();
    }, []);

    return (
        // Menggunakan komponen ScrollArea untuk membuat area scrollable
        <ScrollArea className="h-[500px] rounded-md border p-4">
            {/* Menampilkan tabel untuk daftar karyawan */}
            <Table>
                <TableCaption>Daftar Karyawan</TableCaption>
                <TableHeader>
                    <TableRow className="h-5">
                        <TableHead>No</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Menampilkan setiap data karyawan sebagai baris tabel */}
                    {requests.map((request, index) => (
                        <TableRow key={request.id} className="h-10">
                            {/* Menampilkan nomor urut karyawan */}
                            <TableCell>{index + 1}</TableCell>
                            {/* Menampilkan nama pengguna karyawan */}
                            <TableCell className="font-medium">{request.username}</TableCell>
                            <TableCell>
                                {/* AlertDialog untuk mengonfirmasi penghapusan akun */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Hapus</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Apakah kamu yakin ingin menghapus akun ini?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Mengklik "Lanjutkan" akan menghapus akun karyawan
                                                dan tidak dapat dibatalkan.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            {/* Tombol untuk membatalkan penghapusan */}
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            {/* Tombol untuk melanjutkan penghapusan */}
                                            <AlertDialogAction
                                                onClick={() => deleteUser(request.id)}>
                                                Lanjutkan
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Scrollbar horizontal untuk tabel */}
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
