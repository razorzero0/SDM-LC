const LeaveRequest = require("../models/leaveRequestModel");

/**
 * Membuat permintaan cuti baru
 *
 * @async
 * @function leaveRequest
 * @param {Object} req - Objek request dari Express
 * @param {Object} res - Objek response dari Express
 *
 * Mengambil data pengajuan cuti dari `req.body` dan menyimpannya ke database. Status default adalah "Pending".
 */
exports.leaveRequest = async (req, res) => {
    try {
        // Ambil employeeId dari `req.userData` (hasil middleware autentikasi)
        const employeeId = req.userData.userId;

        // Ambil data pengajuan cuti dari body request
        const { startDate, endDate, reason } = req.body;

        // Buat dokumen baru untuk pengajuan cuti
        const newLeaveRequest = new LeaveRequest({
            employeeId,
            startDate,
            endDate,
            reason,
            status: "Pending", // Status default
        });

        // Simpan dokumen pengajuan cuti ke database
        await newLeaveRequest.save();

        return res.status(201).json({
            message: "Leave Request Created Successfully",
            leaveRequest: newLeaveRequest,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating leave request" });
    }
};

/**
 * Memperbarui status pengajuan cuti
 *
 * @async
 * @function updateLeaveRequestStatus
 * @param {Object} req - Objek request dari Express
 * @param {Object} res - Objek response dari Express
 *
 * Mengubah status pengajuan cuti berdasarkan `requestId` yang diberikan. Validasi status dilakukan.
 */
exports.updateLeaveRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body; // Ambil ID dan status dari body request

        // Validasi nilai status
        const validStatuses = ["Pending", "Approved", "Rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Cari dan perbarui leave request berdasarkan ID
        const leaveRequest = await LeaveRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true, runValidators: true } // `new` untuk mengembalikan dokumen terbaru
        );

        // Jika pengajuan cuti tidak ditemukan
        if (!leaveRequest) {
            return res.status(404).json({ message: "Leave Request not found" });
        }

        return res.status(200).json({
            message: "Leave Request status updated successfully",
            leaveRequest,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating leave request status" });
    }
};

/**
 * Mendapatkan semua pengajuan cuti
 *
 * @async
 * @function getAllLeaveRequests
 * @param {Object} req - Objek request dari Express
 * @param {Object} res - Objek response dari Express
 *
 * Mengambil semua pengajuan cuti dari database dengan memuat data `employeeId` (menggunakan populate).
 */
exports.getAllLeaveRequests = async (req, res) => {
    try {
        // Mengambil semua leave requests dari database
        const leaveRequests = await LeaveRequest.find()
            .populate("employeeId", "username") // Memuat data employeeId dengan field username
            .sort({ createdAt: -1 }); // Urutkan berdasarkan waktu terbaru

        // Jika tidak ada data pengajuan cuti
        if (!leaveRequests || leaveRequests.length === 0) {
            return res.status(404).json({ message: "No leave requests found" });
        }

        return res.status(200).json({
            message: "Leave requests fetched successfully",
            leaveRequests,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching leave requests" });
    }
};

/**
 * Menghapus pengajuan cuti berdasarkan ID
 *
 * @async
 * @function deleteLeaveRequest
 * @param {Object} req - Objek request dari Express
 * @param {Object} res - Objek response dari Express
 *
 * Menghapus pengajuan cuti dari database berdasarkan `requestId` yang diberikan dalam parameter URL.
 */
exports.deleteLeaveRequest = async (req, res) => {
    try {
        const { requestId } = req.params; // Ambil ID dari parameter URL

        // Cari pengajuan cuti berdasarkan ID dan hapus
        const leaveRequest = await LeaveRequest.findByIdAndDelete(requestId);

        // Jika pengajuan cuti tidak ditemukan
        if (!leaveRequest) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        return res.status(200).json({
            message: "Leave request deleted successfully",
            leaveRequest,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting leave request" });
    }
};
