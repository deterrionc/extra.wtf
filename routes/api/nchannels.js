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
const getChannelWithSlug = require("../../utils/getChannelWithSlug")
const getFirstVideo = require("../../utils/getFirstVideo")
const getMusicVideos = require("../../utils/getMusicVideos")
const getNewsVideos = require("../../utils/getNewsVideos")

let serverNews
let serverMusics

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
      jingle_int: {
        video: "",
        playedAt: ""
      },
      jingle_nat: {
        video: "",
        playedAt: ""
      },
      news_int: {
        video: "",
        playedAt: ""
      },
      news_nat: {
        video: "",
        playedAt: ""
      },
      next_news_30: {
        video: "",
        playedAt: ""
      },
      next_news_60: {
        video: "",
        playedAt: ""
      },
      music: {
        video: "",
        playedAt: ""
      }
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

router.get("/get-first-video/:channelslug", async (req, res) => {
  const channelSlug = req.params.channelslug;
  serverMusics = await getMusicVideos();
  serverNews = await getNewsVideos("day");
  let currentTime = new Date();
  let currentMinute = currentTime.getMinutes();
  let currentSecond = currentTime.getSeconds();

  let video = await getFirstVideo(channelSlug, serverMusics, serverNews);

  if (video) {
    res.json({
      success: true,
      video,
      currentMinute,
      currentSecond,
    });
  } else {
    return res.status(404).json({ success: false, message: "No videos found" });
  }
});

router.get("/get-next-video", async (req, res) => {
  try {
    const channelSlug = req.query.slug;
    const videoName = req.query.videoName;
    const videoType = req.query.type;
    let videos = [];

    // Fetch videos
    serverMusics = await getMusicVideos();
    serverNews = await getNewsVideos();

    if (videoType === "music") {
      const channel = serverMusics.find(music => music.slug === channelSlug);
      if (channel) {
        videos = channel.musics;
      }
    }

    if (videoType === "news") {
      const channel = serverNews.find(news => news.slug === channelSlug);
      if (channel) {
        videos = channel.news;
      }
    }

    if (videos.length === 0) {
      return res.status(404).json({ success: false, message: "No videos found" });
    }

    let currentVideoIndex = 0

    if (String(videoName) !== "0") {
      currentVideoIndex = videos.findIndex(video => video.name === videoName);
    }
    
    let nextVideo = null;
    if (currentVideoIndex === -1) {
      return res.status(404).json({ success: false, message: "Video not found" });
    } else if (currentVideoIndex === videos.length - 1) {
      nextVideo = videos[0];
    } else {
      nextVideo = videos[currentVideoIndex + 1];
    }

    nextVideo.type = videoType

    res.json({
      success: true,
      video: nextVideo,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

module.exports = router;
