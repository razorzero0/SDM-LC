// Import dependencies
const request = require("supertest");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../index"); // Sesuaikan dengan path file server Anda
const bcrypt = require("bcryptjs");

let userId; // Variabel untuk menyimpan ID pengguna
let token; // Token untuk autentikasi
let user; // Objek pengguna yang digunakan dalam pengujian

// Mock data untuk pengujian endpoint signup
const mockData = {
    username: "newuser123",
    password: "password123",
};

/**
 * Test suite untuk endpoint signup.
 * Endpoint: POST /api/user/signup
 */
describe("POST /api/user/signup", () => {
    test("should create a new user", async () => {
        const response = await request(app)
            .post("/api/user/signup")
            .send(mockData)
            .expect("Content-Type", /json/)
            .expect(201);

        // Validasi respons
        expect(response.body).toHaveProperty("message", "User Created Successfully");

        // Simpan ID pengguna yang baru dibuat
        userId = response.body.newUser._id;
    }, 20000);
});

/**
 * Test suite untuk endpoint login.
 * Endpoint: POST /api/user/login
 */
describe("POST /api/user/login", () => {
    beforeAll(async () => {
        // Buat pengguna untuk keperluan pengujian login
        const hashedPassword = await bcrypt.hash("password123", 10);
        user = await User.create({
            username: "testuser123",
            password: hashedPassword,
            role: "Admin",
        });
        userId = user._id;
    });

    test("should return 200 and token for valid credentials", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({ username: "testuser123", password: "password123" });

        // Validasi respons sukses login
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        token = response.body.token; // Simpan token untuk pengujian selanjutnya
    });

    test("should return 400 for missing fields", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({ username: "", password: "" });

        // Validasi respons error untuk field yang kosong
        expect(response.status).toBe(400);
    });

    test("should return 401 for invalid username", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({ username: "wronguser", password: "password123" });

        // Validasi respons error untuk username yang salah
        expect(response.status).toBe(401);
    });

    test("should return 401 for invalid password", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({ username: "testuser123", password: "wrongpassword" });

        // Validasi respons error untuk password yang salah
        expect(response.status).toBe(401);
    });
});

/**
 * Test suite untuk endpoint mendapatkan semua pengguna.
 * Endpoint: GET /api/user/all
 */
describe("GET /api/user/all", () => {
    test("should return 401 when unauthorized", async () => {
        const response = await request(app)
            .get("/api/user/all")
            .expect("Content-Type", /json/)
            .expect(401);

        // Validasi error Unauthorized
        expect(response.body).toHaveProperty("message", "Authentification Failed");
    });

    test("should fetch all users successfully when authorized", async () => {
        const response = await request(app)
            .get("/api/user/all")
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200);

        // Validasi respons berhasil
        expect(response.body).toHaveProperty("users");
        expect(response.body.users).toBeInstanceOf(Array);
        expect(response.body.users.length).toBeGreaterThanOrEqual(1);

        // Pastikan tidak ada field password dalam daftar pengguna
        response.body.users.forEach((user) => {
            expect(user).not.toHaveProperty("password");
        });
    });
});

/**
 * Test suite untuk endpoint menghapus pengguna.
 * Endpoint: DELETE /api/user/delete-user/:id
 */
describe("DELETE /api/users/:id", () => {
    test("should delete a user by id", async () => {
        const response = await request(app)
            .delete(`/api/user/delete-user/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200);

        // Validasi respons sukses penghapusan pengguna
        expect(response.body).toHaveProperty("message", "User deleted successfully");

        // Pastikan pengguna benar-benar dihapus dari database
        const deletedUser = await User.findById(userId);
        expect(deletedUser).toBeNull();
    });

    afterAll(async () => {
        // Bersihkan data setelah semua pengujian selesai
        await User.deleteMany({});
        mongoose.connection.close(); // Tutup koneksi ke database
    });
});
