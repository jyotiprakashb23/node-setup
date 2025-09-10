import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../config/redis.js";

export const addUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      handledBy: decoded['id'] // admin's id from token
    });

    // Save user
    await user.save();

    await Admin.findByIdAndUpdate(decoded.id, { $push: { clients: user._id } });

    res.status(201).json({
      message: "User added successfully!",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
    
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate("handledBy", "name email");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET || "yourSecretKey",
            { expiresIn: '1h' }
        );

        await client.set(`user:${user._id}:session`, JSON.stringify({
            id: user._id,
            name: user.name,
            email: user.email,
            handledBy: user.handledBy,
            loginAt: Date.now(),
            token
        }), {
            EX: 3600 // 1 hour expiry, auto-deletes after expiry
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                handledBy: user.handledBy
            }
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            error: error.message,
        });
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("handledBy", "name");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            user,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        
        const updates = req.body;
        const user = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "User updated successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "User deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
