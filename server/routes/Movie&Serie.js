const express = require("express");
const { getSearchResult } = require("../controller/Movie&Serie");
const router = express.Router();

router.get("/search", getSearchResult)

exports.router = router;