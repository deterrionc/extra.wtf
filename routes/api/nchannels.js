const express = require("express");
const router = express.Router();
const config = require('config')

// FILE MANAGE
const fs = require("fs");
const path = require("path");
const dirPath = path.join(config.get('uploadDirectory'), "channels")

// FILE UPLOAD
const createMulterInstance = require("../../utils/createMulterInstance");
const getCurrentTimeFilePath = require("../../utils/getCurrentTimeFilePath")

router.post("/create-channel/", async (req, res) => {
  let uploadPath = path.join(dirPath, getCurrentTimeFilePath())

  try {
    fs.mkdirSync(uploadPath)
    fs.mkdirSync(`${uploadPath}/music`)
    fs.mkdirSync(`${uploadPath}/jingle_int`)
    fs.mkdirSync(`${uploadPath}/jingle_nat`)
    fs.mkdirSync(`${uploadPath}/news_nat`)
    fs.mkdirSync(`${uploadPath}/news_int`)
    fs.mkdirSync(`${uploadPath}/next_news_30`)
    fs.mkdirSync(`${uploadPath}/next_news_60`)
    const imageUpload = createMulterInstance(uploadPath)

    await new Promise((resolve, reject) => {
      imageUpload.fields([{ name: "image", maxCount: 1 }])(req, res, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })

    let imageName = req.files["image"][0].filename

    const channelData = {
      name: req.body.name || "",
      slug: req.body.slug || "",
      image: imageName || ""
    }

    const channelJsonPath = path.join(uploadPath, 'channel.json')
    fs.writeFileSync(channelJsonPath, JSON.stringify(channelData, null, 2))

    const playListData = {
      jingle_int: "",
      jingle_nat: "",
      news_int: "",
      news_nat: "",
      next_news_30: "",
      next_news_60: "",
    }

    const playListJsonPath = path.join(uploadPath, 'playList.json')
    fs.writeFileSync(playListJsonPath, JSON.stringify(playListData, null, 2))

    res.json({
      success: true,
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    })
  }
})

router.get("/get-channels/", async (req, res) => {
  try {
    let channelDirs = fs.readdirSync(dirPath)

    let channels = []

    channelDirs.forEach((dir) => {
      let channelPath = path.join(dirPath, dir, 'channel.json')
      if (fs.existsSync(channelPath)) {
        let channelData = fs.readFileSync(channelPath, 'utf8')
        let channel = JSON.parse(channelData)
        channel.path = "upload/channels/" + dir
        channel.id = dir
        channels.push(channel)
      }
    })

    res.json({
      success: true,
      channels: channels
    })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: err.message
    })
  }
})

router.get("/get-channel/:channelPath", async (req, res) => {
  const channelId = req.params.channelPath
  const channelPath = path.join(dirPath, channelId)

  // Check if folder exists
  if (fs.existsSync(channelPath)) {
    const jsonFilePath = path.join(channelPath, 'channel.json')
    
    // Check if channel.json exists
    if (fs.existsSync(jsonFilePath)) {
      try {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
        let channel = JSON.parse(jsonData)
        channel.path = "upload/channels/" + channelId
        channel.id = channelId
        res.json({
          success: true,
          channel
        })
      } catch (err) {
        res.json({
          success: false,
          message: `Error reading channel.json: ${err.message}`,
        })
      }
    } else {
      res.json({
        success: false,
        message: 'channel.json not found',
      })
    }
  } else {
    res.json({
      success: false,
      message: 'Folder not found',
    })
  }
})

router.post("/update-channel/:id", async (req, res) => {
  const channelId = req.params.id
  const channelPath = path.join(dirPath, channelId)
  const jsonFilePath = path.join(channelPath, 'channel.json')
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
  let channel = JSON.parse(jsonData)
  channel.name = req.body.name
  channel.slug = req.body.slug
  fs.writeFileSync(jsonFilePath, JSON.stringify(channel, null, 2))

  res.json({
    success: true
  })
})

router.post("/update-channel-with-image/:id", async (req, res) => {
  const channelId = req.params.id
  let channelPath = path.join(dirPath, channelId)
  const jsonFilePath = path.join(channelPath, 'channel.json')
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
  let channel = JSON.parse(jsonData)

  const imageUpload = createMulterInstance(channelPath)
  await new Promise((resolve, reject) => {
    imageUpload.fields([{ name: "image", maxCount: 1 }])(req, res, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
  let imageName = req.files["image"][0].filename

  const oldImagePath = path.join(channelPath, channel.image);
  fs.unlink(oldImagePath, (err) => {
    if (err) {
      console.error(`Failed to delete old image: ${err}`);
    }
  });

  channel.name = req.body.name
  channel.slug = req.body.slug
  channel.image = imageName

  fs.writeFileSync(jsonFilePath, JSON.stringify(channel, null, 2))

  res.json({
    success: true
  })
})

router.delete("/delete-channel/:channelPath", async (req, res) => {
  const deletePath = path.join(dirPath, req.params.channelPath)

  fs.rm(deletePath, { recursive: true }, (err) => {
    if (err) {
      return res.json({
        success: false,
        message: err.message,
      })
    }

    res.json({
      success: true,
    })
  })
})

module.exports = router;
