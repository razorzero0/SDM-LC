"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { TableRequest } from "./tableRequest";
import isAdmin from "@/services/isAdmin";
import LeaveRequest from "./leaveRequest";
import DataEmployee from "./dataEmployee";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("authToken");

    useEffect(() => {}, [loading]);
    const isAdminRole = isAdmin();
    return (
        <Tabs defaultValue="ajukan-cuti" className="w-[350px] sm:w-[600px] ">
            <ScrollArea className="w-full">
                <TabsList className={` grid w-full ${isAdminRole ? "grid-cols-3" : "grid-cols-2"}`}>
                    <TabsTrigger value="ajukan-cuti">Pengajuan Cuti</TabsTrigger>
                    <TabsTrigger value="data-cuti">Data Cuti</TabsTrigger>
                    {isAdminRole && <TabsTrigger value="data-karyawan">Data Karyawan</TabsTrigger>}
                </TabsList>
            </ScrollArea>
            <TabsContent value="data-karyawan" className="">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Data Karyawan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <DataEmployee token={token} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="ajukan-cuti" className="">
                <Card>
                    <CardHeader>
                        <CardTitle> {isAdminRole ? "Pengajuan Cuti" : "employee"}</CardTitle>
                        <CardDescription>
                            Formulir untuk mengajukan permohonan cuti. Pastikan semua informasi yang
                            dimasukkan sudah benar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <LeaveRequest loading={loading} setLoading={setLoading} token={token} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="data-cuti">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Data Cuti Karyawan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <TableRequest isAdmin={isAdminRole} token={token} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
