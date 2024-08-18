const express = require("express");
const { findMovieOrSeriesById, getCategory } = require("../controller/Movie&Serie");
const router = express.Router();

router.get("/detail/:id", findMovieOrSeriesById).get("/get-category/:category", getCategory)

exports.router = router;
