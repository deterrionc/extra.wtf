const express = require("express");
const router = express.Router();

// FILE DELETE
var fs = require("fs");
var path = require("path");

router.post("/create-article", async (req, res) => {
  console.log('ok')
  res.json({
    success: true,
  });
});

router.get("/get-articles", async (req, res) => {
  res.json({
    success: false,
  });
});

router.get("/get-article/:id", async (req, res) => {
  res.json({
    success: true,
  });
});

router.delete("/delete-article/:id", async (req, res) => {
  res.json({
    success: true,
  });
});

module.exports = router;
