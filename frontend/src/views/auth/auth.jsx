// Import komponen yang digunakan dalam UI
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import Register from "./register"; // Komponen untuk formulir pendaftaran
import Login from "./login"; // Komponen untuk formulir login

// Definisikan skema validasi menggunakan Zod
const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username tidak boleh kosong.", // Validasi agar username tidak kosong
    }),
    password: z.string().min(5, {
        message: "Password minimal 5 karakter.", // Validasi agar password memiliki minimal 5 karakter
    }),
});

export default function Auth() {
    const [loading, setLoading] = useState(false); // State untuk mengatur status loading

    // Inisialisasi form menggunakan react-hook-form dan validasi Zod
    const form = useForm({
        resolver: zodResolver(formSchema), // Gunakan zod untuk validasi
        defaultValues: {
            username: "",
            password: "",
        },
    });

    // Efek untuk menangani status loading
    useEffect(() => {}, [loading]);

    return (
        <Tabs defaultValue="register" className="w-80 md:w-[400px]">
            {/* Daftar Tab untuk memilih Register atau Login */}
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register">Register</TabsTrigger> {/* Tab untuk Register */}
                <TabsTrigger value="login">Login</TabsTrigger> {/* Tab untuk Login */}
            </TabsList>

            {/* Konten untuk tab Register */}
            <TabsContent value="register" className="">
                <Card>
                    <CardHeader>
                        <CardTitle>Register</CardTitle> {/* Judul untuk tab Register */}
                        <CardDescription>
                            Masukkan username dan password untuk membuat akun karyawan baru.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Register loading={loading} setLoading={setLoading} form={form} />
                        {/* Komponen Register yang menerima props loading, setLoading, dan form */}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Konten untuk tab Login */}
            <TabsContent value="login">
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle> {/* Judul untuk tab Login */}
                        <CardDescription>
                            Masukkan username dan password untuk login ke akun karyawan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Login loading={loading} setLoading={setLoading} form={form} />
                        {/* Komponen Login yang menerima props loading, setLoading, dan form */}
                    </CardContent>
                    <CardFooter>
                        <CardDescription className="text-center">
                            Login sebagai admin, username : 'admin' , password : 'admin'
                        </CardDescription>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
