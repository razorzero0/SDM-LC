"use client";

// Import komponen UI dari pustaka yang digunakan
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Import hook dan pustaka lainnya
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { formatDateLong } from "@/lib/formatDate";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import getUserId from "@/services/getUserId";

// Komponen utama untuk menampilkan tabel permintaan cuti
export function TableRequest({ isAdmin, token }) {
    const baseUrl = import.meta.env.VITE_API_URL;

    // State untuk menyimpan data permintaan cuti
    const [requests, setRequests] = useState([]);

    // Mengambil ID pengguna saat ini
    const userId = getUserId();

    // Fungsi untuk mengambil data permintaan cuti
    const getAllRequest = async () => {
        try {
            // Mengambil data dari API
            const response = await axios.get(baseUrl + "/api/request/all", {
                headers: {
                    Authorization: `Bearer ${token}`, // Menambahkan token otorisasi
                },
            });

            // Memformat data permintaan cuti
            const formattedRequests = response.data.leaveRequests
                .filter((request) => isAdmin || request.employeeId._id === userId) // Menampilkan data sesuai userId
                .map((request) => ({
                    id: request._id,
                    employeeId: request.employeeId._id,
                    username: request.employeeId.username,
                    startDate: formatDateLong(request.startDate), // Memformat tanggal mulai cuti
                    endDate: formatDateLong(request.endDate), // Memformat tanggal akhir cuti
                    status: request.status,
                    reason: request.reason, // Menyimpan alasan cuti
                }));

            // Menyimpan data yang sudah diformat ke state
            setRequests(formattedRequests);
        } catch (error) {
            // Menampilkan error jika gagal mengambil data
            console.error("Gagal mengambil data", error);
        }
    };

    // Fungsi untuk mengubah status permintaan cuti
    const updateStatus = async (id, status) => {
        try {
            // Mengirimkan permintaan untuk mengubah status cuti
            const response = await axios.put(
                baseUrl + "/api/request/update-leave-request",
                {
                    requestId: id,
                    status: status, // Status yang ingin diubah
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Menambahkan token otorisasi
                    },
                }
            );

            // Menampilkan notifikasi jika proses berhasil
            toast("Proses Berhasil ✅", {
                description: "Berhasil ubah status cuti",
                action: {
                    label: "tutup",
                    onClick: () => console.log("tutup"),
                },
            });

            // Memanggil kembali fungsi untuk mendapatkan data terbaru setelah status diubah
            await getAllRequest();
        } catch (error) {
            // Menampilkan error jika gagal mengubah status
            console.error("Gagal ubah status", error);
            Toast("Gagal ubah status ❌", {
                description: error.response.data.message,
                action: {
                    label: "tutup",
                    onClick: () => console.log("tutup"),
                },
            });
        }
    };

    // Menjalankan fungsi untuk mengambil data permintaan cuti saat komponen pertama kali dimuat
    useEffect(() => {
        getAllRequest();
    }, []);

    return (
        // Menggunakan komponen ScrollArea untuk membuat area scrollable
        <ScrollArea className="h-[500px] rounded-md border p-4">
            {/* Tabel untuk menampilkan permintaan cuti */}
            <Table>
                <TableCaption>Daftar karyawan yang mengajukan cuti.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Mulai cuti</TableHead>
                        <TableHead>Akhir cuti</TableHead>
                        <TableHead>Alasan</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Menampilkan baris tabel berdasarkan data permintaan cuti */}
                    {requests.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.username}</TableCell>
                            <TableCell>{request.startDate}</TableCell>
                            <TableCell>{request.endDate}</TableCell>
                            <TableCell>
                                {/* Popover untuk menampilkan alasan cuti */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">Lihat</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <ScrollArea className="h-40 break-all whitespace-normal">
                                            {request.reason}
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                            <TableCell>
                                {/* Jika user adalah admin, tampilkan dropdown untuk mengubah status */}
                                {isAdmin ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={
                                                    request.status === "Rejected"
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : request.status === "Approved"
                                                        ? "bg-green-600 hover:bg-green-700"
                                                        : ""
                                                }>
                                                {request.status}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel>Ubah status cuti</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup
                                                value={request.status}
                                                onValueChange={(status) =>
                                                    updateStatus(request.id, status)
                                                }>
                                                <DropdownMenuRadioItem value="Pending">
                                                    Pending
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Approved">
                                                    Approve
                                                </DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Rejected">
                                                    Reject
                                                </DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className={
                                            request.status === "Rejected"
                                                ? "bg-red-600 hover:bg-red-700"
                                                : request.status === "Approved"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : ""
                                        }>
                                        {request.status}
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Scrollbar untuk tabel horizontal */}
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
