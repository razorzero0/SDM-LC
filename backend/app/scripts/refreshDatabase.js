const mongoose = require("mongoose");
const { connectDb } = require("../config/database");
const User = require("../models/userModel"); // Sesuaikan path dengan model Anda
const bcrypt = require("bcryptjs");

/**
 * Function to refresh the database:
 * 1. Clears all collections (deletes all data).
 * 2. Seeds an admin user with a default password.
 *
 * @async
 * @function refreshDatabase
 * @returns {Promise<void>} Resolves when the database has been refreshed and closed.
 * @throws {Error} If there is an error during database connection, collection deletion, or user creation.
 */
const refreshDatabase = async () => {
    try {
        // Koneksi ke database
        await connectDb();

        // Hapus semua koleksi (menghapus semua data)
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
        console.log("All collections cleared.");

        // Seed admin user
        const hashedPassword = await bcrypt.hash("admin", 10); // Ganti password sesuai kebutuhan
        const adminUser = new User({
            username: "admin",
            password: hashedPassword,
            role: "Admin",
        });
        await adminUser.save();
        console.log("Admin user seeded successfully.");
    } catch (error) {
        console.error("Error refreshing database:", error);
    } finally {
        // Tutup koneksi database
        await mongoose.disconnect();
        console.log("Database disconnected.");
    }
};

// Jalankan fungsi
refreshDatabase();
