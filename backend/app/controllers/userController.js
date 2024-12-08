const bcrypt = require("bcryptjs"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for generating JSON Web Tokens
const User = require("../models/userModel"); // User model for interacting with the user database
const LeaveRequest = require("../models/leaveRequestModel"); // LeaveRequest model for handling leave requests

/**
 * Registers a new user in the system.
 *
 * @async
 * @function signUp
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Contains the username and password of the new user.
 * @param {string} req.body.username - The username for the new user.
 * @param {string} req.body.password - The password for the new user.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing a success message and the newly created user, or an error message.
 */
exports.signUp = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the input fields are valid
        if (!username || !password) {
            return res.status(400).json({ message: "Please Input Username and Password" });
        }

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        // Hash the user's password
        const saltRounds = 10; // Number of hashing rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save the user to the database
        const newUser = new User({
            username,
            password: hashedPassword,
        });
        await newUser.save();

        return res.status(201).json({ message: "User Created Successfully", newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating user" });
    }
};

/**
 * Logs a user into the system.
 *
 * @async
 * @function logIn
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Contains the username and password for login.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing a success message, user data, and a JWT token, or an error message.
 */
exports.logIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the input fields are valid
        if (!username || !password) {
            return res.status(400).json({ message: "Please Input Username and Password" });
        }

        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login Successful", data: user, token });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Error during login" });
    }
};

/**
 * Retrieves all users from the database.
 *
 * @async
 * @function getAllUsers
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing a list of users or an error message.
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Retrieve all users, excluding their password fields
        const users = await User.find({}, { password: 0 });
        return res.status(200).json({ users });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Error fetching users" });
    }
};

/**
 * Deletes a user and their associated leave requests from the database.
 *
 * @async
 * @function deleteUser
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.userId - The ID of the user to delete.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response containing a success message and deleted user data, or an error message.
 */
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Delete all leave requests associated with the user
        await LeaveRequest.deleteMany({ employeeId: userId });

        // Find and delete the user by their ID
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            deletedUser: user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting user" });
    }
};
