const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

// FILE DELETE
var fs = require("fs");
var path = require("path");

router.get("/", async (req, res) => {
  exec("cd /home/OMG/video1 && ./playout_program_mp4", (error, stdout, stderr) => {
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
