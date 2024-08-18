const { User } = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

exports.createUser = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    const saltRounds = process.env.SALT_ROUND;
    const hashedPassword = bcrypt.hash(req.body.password, saltRounds);

    req.body.password = hashedPassword;

    const user = new User(req.body);
    const savedUser = await user.save();

    const { password, ...userData } = savedUser.toObject();
    res
      .status(201)
      .json({ message: "User created successfully.", user: userData });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Invalid input data.", errors: error.errors });
    }

    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "30d",
      }); // 30 days expiration
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      }); // Set cookie

      const { password, ...userData } = user.toObject();
      res.status(200).json({
        message: "Login successful",
        user: userData,
        token: token, // Send token back to frontend
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, secretKey); // Decode the token

    if (!decoded.userId) {
      return res
        .status(401)
        .json({ valid: false, message: "Invalid token payload" });
    }
    const userData = {
      valid: true,
      userId: decoded.userId,
    };

    req.user = userData;

    res.json(userData);
    next();
  } catch (err) {
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
};

exports.signOut = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    jwt.verify(token, secretKey);

    res.clearCookie("token", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
