const request = require("supertest");
const app = require("../index"); // Sesuaikan dengan path file server Anda
const LeaveRequest = require("../models/leaveRequestModel");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const mongoose = require("mongoose");

let token;
describe("Login to get token", () => {
    beforeAll(async () => {
        // Setup user data di database
        const hashedPassword = await bcrypt.hash("password123", 10);
        user = await User.create({
            username: "testuser1234",
            password: hashedPassword,
            role: "Admin",
        });
    });

    test("should get token", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({ username: "testuser1234", password: "password123" });

        expect(response.status).toBe(200);

        token = response.body.token;
    });
});

let reqId;

describe("Leave Request All tests", () => {
    /**
     * Test untuk membuat permintaan cuti baru.
     * Endpoint: POST /api/request/leave-request
     */
    test("POST /create - create a leave request", async () => {
        // Mock data untuk membuat permintaan cuti
        const mockData = {
            startDate: "2024-12-10",
            endDate: "2024-12-12",
            reason: "Personal Leave", // Alasan cuti
        };

        // Kirim request POST untuk membuat permintaan cuti
        const response = await request(app)
            .post("/api/request/leave-request")
            .set("Authorization", `Bearer ${token}`) // Menyertakan token autentikasi
            .send(mockData);

        // Simpan ID permintaan cuti untuk pengujian selanjutnya
        reqId = response.body.leaveRequest._id;

        // Verifikasi respons
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Leave Request Created Successfully");
    });

    /**
     * Test untuk mendapatkan semua permintaan cuti.
     * Endpoint: GET /api/request/all
     */
    test("GET /all - fetch all leave requests", async () => {
        const response = await request(app)
            .get("/api/request/all")
            .set("Authorization", `Bearer ${token}`); // Menyertakan token autentikasi

        // Verifikasi respons
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Leave requests fetched successfully");
        expect(response.body.leaveRequests).toBeInstanceOf(Array); // Pastikan hasil adalah array
        expect(response.body.leaveRequests.length).toBeGreaterThan(0); // Pastikan ada setidaknya satu permintaan
    });

    /**
     * Test untuk memperbarui status permintaan cuti.
     * Endpoint: PUT /api/request/update-leave-request
     */
    test("PUT /update-status - update leave request status", async () => {
        const requestBody = {
            requestId: reqId, // ID permintaan cuti yang akan diperbarui
            status: "Approved", // Status baru
        };

        const response = await request(app)
            .put("/api/request/update-leave-request")
            .set("Authorization", `Bearer ${token}`) // Menyertakan token autentikasi
            .send(requestBody);

        // Verifikasi respons
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Leave Request status updated successfully");
        expect(response.body.leaveRequest.status).toBe("Approved"); // Verifikasi status telah diperbarui
    });

    /**
     * Test untuk menghapus permintaan cuti.
     * Endpoint: DELETE /api/request/delete-request/:requestId
     */
    test("DELETE /delete/:requestId - delete a leave request", async () => {
        const response = await request(app)
            .delete(`/api/request/delete-request/${reqId}`) // Menghapus permintaan cuti berdasarkan ID
            .set("Authorization", `Bearer ${token}`); // Menyertakan token autentikasi

        // Verifikasi respons
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Leave request deleted successfully");
    });

    /**
     * Setelah semua pengujian selesai, bersihkan data dan tutup koneksi database.
     */
    afterAll(async () => {
        await User.deleteMany({}); // Hapus semua data pengguna (opsional, jika diperlukan)
        mongoose.connection.close(); // Tutup koneksi database
    });
});
