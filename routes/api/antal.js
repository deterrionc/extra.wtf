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

router.get("/get-video", async (req, res) => {
  exec("cd /home/OMG/video1 && ./playout_program_mp4", (error, stdout, stderr) => {
    if (stderr) {
      console.log(`error: ${stderr}`);
      res.json({
        success: false,
        message: stderr
      })
    } else {
      let videoPath = stdout.replace("/home/OMG/", "/")
      console.log("HERE")
      console.log(videoPath)
      res.json({
        success: true,
        videoPath
      })
    }
  });
})

module.exports = router;
