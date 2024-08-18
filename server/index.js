const express = require("express");
const server = express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRouters = require("./routes/Auth");
const movieRouters = require("./routes/Movie");
const serieRouters = require("./routes/Serie");
const movieANDserieRouters = require("./routes/Movie&Serie");
require("dotenv").config();

server.use(express.json());
server.use(morgan("dev"));
server.use(cookieParser());
server.use(
  cors({
    origin: process.env.FRONT_END,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

server.use("/auth", authRouters.router);
server.use("/movie", movieRouters.router);
server.use("/serie", serieRouters.router);
server.use("/movie&serie", movieANDserieRouters.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    process.env.MONGO_DB
  );
  console.log("DataBase connected");
}

server.get("/", (req, res) => {
  res.json({ status: "Success" });
});

server.listen(8080, () => {
  console.log("Server started");
});
