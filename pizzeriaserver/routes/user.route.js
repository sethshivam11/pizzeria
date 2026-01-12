import { Router } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, async (req, res) => {
  const data = req.user;
  return res.status(200).json({
    success: true,
    data,
    message: "User found",
  });
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email & Password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const safeUser = user.toObject();
    safeUser.password = undefined;

    const token = await jwt.sign(safeUser, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        data: { ...safeUser, token },
        message: "User registered successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with this email doesn't exists",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const safeUser = user.toObject();
    safeUser.password = undefined;

    const token = jwt.sign(safeUser, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        data: { ...safeUser, token },
        message: "User logged in successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/logout", async (req, res) => {
  return res.status(200).clearCookie("token").json({
    success: true,
    message: "User logged out successfully",
  });
});

export default router;
