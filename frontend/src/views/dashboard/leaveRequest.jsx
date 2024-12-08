// Import komponen dan dependensi yang dibutuhkan
import { Button } from "@/components/ui/button"; // Button untuk interaksi pengguna
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"; // Komponen form dari UI library
import { Loader2 } from "lucide-react"; // Ikon untuk loading spinner
import { z } from "zod"; // Library untuk validasi schema
import { zodResolver } from "@hookform/resolvers/zod"; // Resolver untuk menghubungkan Zod dengan React Hook Form
import { useForm } from "react-hook-form"; // Hook untuk mengelola form
import { useEffect } from "react"; // Hook untuk menangani efek samping
import axios from "axios"; // Library untuk mengirim request HTTP
import { CalendarIcon } from "lucide-react"; // Ikon kalender
import { format } from "date-fns"; // Library untuk memformat tanggal
import { cn } from "@/lib/utils"; // Fungsi utility untuk menggabungkan className
import { toast as sonnerToast } from "sonner"; // Library untuk menampilkan notifikasi toast
import { Calendar } from "@/components/ui/calendar"; // Komponen kalender
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Komponen popover untuk memilih tanggal
import { Textarea } from "@/components/ui/textarea"; // Komponen textarea untuk input alasan

// Definisikan schema validasi menggunakan Zod
const formSchema = z.object({
    startDate: z.date({
        required_error: "Tanggal mulai cuti tidak boleh kosong.",
    }),
    endDate: z.date({
        required_error: "Tanggal berakhir cuti tidak boleh kosong.",
    }),
    reason: z.string().min(1, {
        message: "Alasan cuti tidak boleh kosong", // Validasi alasan tidak boleh kosong
    }),
});

// Komponen utama untuk form pengajuan cuti
export default function LeaveRequest({ loading, setLoading, token }) {
    const baseUrl = import.meta.env.VITE_API_URL;

    // Inisialisasi form dengan validasi menggunakan react-hook-form dan zod
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startDate: "", // Nilai default untuk tanggal mulai
            endDate: "", // Nilai default untuk tanggal akhir
            reason: "", // Nilai default untuk alasan cuti
        },
    });

    // Fungsi untuk memformat tanggal menjadi format "YYYY-MM-DD"
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // Format ke "YYYY-MM-DD"
    };

    // Fungsi yang menangani pengiriman form
    const onSubmitLeaveRequest = async (value) => {
        setLoading(true); // Set loading ke true untuk menandakan form sedang diproses
        try {
            // Mengirimkan request POST ke API dengan data form
            const response = await axios.post(
                baseUrl + "/api/request/leave-request", // Endpoint API untuk pengajuan cuti
                {
                    startDate: formatDate(value.startDate), // Format tanggal mulai
                    endDate: formatDate(value.endDate), // Format tanggal akhir
                    reason: value.reason, // Alasan cuti
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Menambahkan token autentikasi pada header
                    },
                }
            );

            // Menampilkan notifikasi sukses setelah pengajuan cuti berhasil
            sonnerToast("Berhasil ajukan cuti ✅", {
                description: "Mohon tunggu HRD untuk memprosesnya", // Pesan sukses
                action: {
                    label: "tutup", // Label untuk tombol aksi
                    onClick: () => console.log("tutup"), // Aksi saat tombol diklik
                },
            });
            form.reset(); // Reset form setelah pengajuan berhasil
        } catch (error) {
            // Menangani error jika pengajuan gagal
            console.error("Gagal Ajukan Cuti", error);
            sonnerToast("Gagal Ajukan Cuti ❌", {
                description: error.response.data.message, // Menampilkan pesan error dari API
                action: {
                    label: "tutup",
                    onClick: () => console.log("tutup"),
                },
            });
        } finally {
            // Set loading ke false setelah pengiriman selesai
            setLoading(0); // Menyembunyikan loading
        }
    };

    // Gunakan useEffect jika perlu (misalnya untuk mengamati perubahan status loading)

    return (
        // Menampilkan form dengan validasi dan pengiriman data
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitLeaveRequest)} className="space-y-4">
                {/* Field untuk memilih tanggal mulai cuti */}
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Mulai Cuti</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                " pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}>
                                            {field.value ? (
                                                format(field.value, "PPP") // Menampilkan tanggal dalam format PPP (long date format)
                                            ) : (
                                                <span>Pilih tanggal</span> // Placeholder jika belum memilih tanggal
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("2020-12-09")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>Pengajuan tanggal dimulai cuti anda.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Field untuk memilih tanggal akhir cuti */}
                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Akhir Cuti</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                " pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}>
                                            {field.value ? (
                                                format(field.value, "PPP") // Menampilkan tanggal akhir
                                            ) : (
                                                <span>Pilih tanggal</span> // Placeholder jika belum memilih tanggal
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("2020-12-09")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Pengajuan tanggal berakhirnya cuti anda.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Field untuk alasan cuti */}
                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Alasan Cuti</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Acara keluarga ..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Berikan alasan kenapa cuti.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Tombol untuk submit form */}
                <div className="flex justify-end">
                    {loading ? (
                        <Button disabled>
                            <Loader2 className="animate-spin" />
                            Mohon Tunggu
                        </Button>
                    ) : (
                        <Button className="mt-3" type="submit">
                            Ajukan Cuti
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
