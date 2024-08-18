const express = require("express");
const { createUser, loginUser, verifyToken, signOut } = require("../controller/Auth");
const router = express.Router();

router.post("/signup", createUser).post("/login", loginUser).get("/verify", verifyToken).get("/signout", signOut);

exports.router = router;
