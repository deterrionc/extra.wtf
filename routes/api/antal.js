const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.get("/get-video/:channelID", async (req, res) => {
  const channelID = req.params.channelID
  exec(`cd /home/OMG/video${channelID} && ./playout_program_mp4`, (error, stdout, stderr) => {
    if (stderr) {
      console.log(`error: ${stderr}`);
      res.json({
        success: false,
        message: stderr
      })
    } else {
      let output = stdout.replace("/home/OMG/", "/av/")
      let lines = output.split('\n');
      let videoPath = lines[0]; 
      console.log(videoPath)
      res.json({
        success: true,
        videoPath
      })
    }
  });
})

module.exports = router;
