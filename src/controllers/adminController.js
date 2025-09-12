import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../config/redis.js";

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || "yourRefreshSecretKey"
        );

        // Optionally, check if session exists in Redis
        const session = await client.get(`admin:${decoded.id}:session`);
        if (!session) {
            return res.status(401).json({ success: false, message: "Session not found or expired" });
        }

        // Issue new access token
        const newAccessToken = jwt.sign(
            { id: decoded.id, username: decoded.username, role: "admin" },
            process.env.JWT_SECRET || "yourSecretKey",
            { expiresIn: "1h" }
        );

        // Update session in Redis with new access token
        const sessionData = JSON.parse(session);
        sessionData.accessToken = newAccessToken;
        await client.set(`admin:${decoded.id}:session`, JSON.stringify(sessionData), { EX: 3600 });

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        // Try to get users from Redis cache first
        const cachedUsers = await client.get("users:all");
        if (cachedUsers) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedUsers), cached: true });
        }

        // If not cached, fetch from DB
        const users = await User.find({});
        // Store result in cache for future requests
        await client.set("users:all", JSON.stringify(users), { EX: 300 }); // cache for 5 minutes

        res.status(200).json({ success: true, data: users, cached: false });
    } catch (error) {
        console.log(error);        
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAdmin = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, username, email, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ success: true, data: newAdmin });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id).populate("clients", "name");
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, data: admin });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // 🔑 Generate Access Token
        const accessToken = jwt.sign(
            { id: admin._id, username: admin.username, role: "admin" },
            process.env.JWT_SECRET || "yourSecretKey",
            { expiresIn: "1h" }
        );

        // 🔑 Generate Refresh Token
        const refreshToken = jwt.sign(
            { id: admin._id, username: admin.username, role: "admin" },
            process.env.JWT_REFRESH_SECRET || "yourRefreshSecretKey",
            { expiresIn: "7d" }
        );

        // Store admin session in cache (Redis)
        await client.set(`admin:${admin._id}:session`, JSON.stringify({
            id: admin._id,
            username: admin.username,
            email: admin.email,
            loginAt: Date.now(),
            accessToken,
            refreshToken
        }), { EX: 3600 }); // expires in 1 hour

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (!req.params.id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}