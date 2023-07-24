const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

// FILE DELETE
var fs = require("fs");
var path = require("path");

router.get("/", async (req, res) => {
  exec("node -v", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });

  res.json({
    success: true,
  });
});

module.exports = router;
