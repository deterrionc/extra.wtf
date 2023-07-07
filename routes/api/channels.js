const express = require("express");
const router = express.Router();

// DB MODEL
const Channel = require("../../models/Channel");
const Video = require("../../models/Video");
const PlayLog = require("../../models/PlayLog");

// FILE UPLOAD
const fileUpload = require("../../utils/fileUpload");

// FILE DELETE
var fs = require("fs");
const Category = require("../../models/Category");
// const getVideoDuration = require('../../utils/getVideoDuration');

// For Scheduling
const schedule = require("node-schedule");

router.post(
  "/create-channel",
  fileUpload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    let imagePath = req.files["image"][0].path;

    let newChannel = new Channel({
      name: req.body.name,
      image: imagePath,
    });

    await newChannel.save();

    res.json({
      success: true,
    });
  }
);

router.get("/get-channels", async (req, res) => {
  const channels = await Channel.find();

  res.json({
    success: true,
    channels,
  });
});

router.get("/get-channel/:id", async (req, res) => {
  const channelID = req.params.id;
  const channel = await Channel.findById(channelID);

  res.json({
    success: true,
    channel,
  });
});

router.get("/get-channel-videos", async (req, res) => {
  let currentTime = new Date();
  let currentMinute = currentTime.getMinutes();
  let currentHour = currentTime.getHours();
  let currentSecond = currentTime.getSeconds();
  let _videos = [];

  if (currentHour >= 6 && currentHour <= 18) {
    // Day time
    if (currentMinute % 30 >= 5) {
      // Return Music
      const musicCategories = await Category.find({ type: "music" }).populate("videos");
      musicCategories.forEach(mc => {
        mc.videos.forEach(v => {
          _videos.push(v)
        })
      })
      _videos.sort((v1, v2) => v1.playedAt - v2.playedAt)

      res.json({
        success: true,
        videos: _videos,
        currentMinute,
        currentSecond,
        currentCategory: "music",
      });
    } else {
      // Return News
      const _jingle_nat = await Category.findOne({ name: "jingle_nat" }).populate("videos");
      let _jingle_nat_videos = _jingle_nat.videos.sort((v1, v2) => v1.playedAt - v2.playedAt);
      _videos.push(_jingle_nat_videos[0]);

      const _news_nat = await Category.findOne({ name: "news_nat" }).populate("videos");
      let _news_nat_videos = _news_nat.videos.sort((v1, v2) => v1.playedAt - v2.playedAt).slice(0, 3);
      _news_nat_videos.forEach((v) => _videos.push(v));

      const _jingle_int = await Category.findOne({ name: "jingle_int" }).populate("videos");
      let _jingle_int_videos = _jingle_int.videos.sort((v1, v2) => v1.playedAt - v2.playedAt);
      _videos.push(_jingle_int_videos[0]);

      const _news_int = await Category.findOne({ name: "news_int" }).populate("videos");
      let _news_int_videos = _news_int.videos.sort((v1, v2) => v1.playedAt - v2.playedAt).slice(0, 3);
      _news_int_videos.forEach((v) => _videos.push(v));

      const _music_long = await Category.findOne({ name: "music_long"}).populate("videos");
      let temp_videos = _music_long.videos.sort((v1, v2) => v1.playedAt - v2.playedAt);
      _videos.push(temp_videos[0]);

      res.json({
        success: true,
        videos: _videos,
        currentMinute,
        currentSecond,
        currentCategory: "news",
      });
    }
  } else {
    // Night Time
    if (currentMinute % 60 >= 5) {
      // Return Music
      const musicCategories = await Category.find({ type: "music" }).populate("videos");
      musicCategories.forEach(mc => {
        mc.videos.forEach(v => {
          _videos.push(v)
        })
      })
      _videos.sort((v1, v2) => v1.playedAt - v2.playedAt)

      res.json({
        success: true,
        videos: _videos,
        currentMinute,
        currentSecond,
        currentCategory: "music",
      });
    } else {
      // Return News
      const _jingle_nat = await Category.findOne({ name: "jingle_nat" }).populate("videos");
      let _jingle_nat_videos = _jingle_nat.videos.sort((v1, v2) => v1.playedAt - v2.playedAt);
      _videos.push(_jingle_nat_videos[0]);

      const _news_nat = await Category.findOne({ name: "news_nat" }).populate("videos");
      let _news_nat_videos = _news_nat.videos.sort((v1, v2) => v1.playedAt - v2.playedAt).slice(0, 3);
      _news_nat_videos.forEach((v) => _videos.push(v));

      const _jingle_int = await Category.findOne({ name: "jingle_int" }).populate("videos");
      let _jingle_int_videos = _jingle_int.videos.sort((v1, v2) => v1.playedAt - v2.playedAt);
      _videos.push(_jingle_int_videos[0]);

      const _news_int = await Category.findOne({ name: "news_int" }).populate("videos");
      let _news_int_videos = _news_int.videos.sort((v1, v2) => v1.playedAt - v2.playedAt).slice(0, 3);
      _news_int_videos.forEach((v) => _videos.push(v));

      const _music_long = await Category.findOne({ name: "music_long"}).populate("videos");
      let temp_videos = _music_long.videos.sort((v1, v2) => v1.playedAt - v2.playedAt);
      _videos.push(temp_videos[0]);

      res.json({
        success: true,
        videos: _videos,
        currentMinute,
        currentSecond,
        currentCategory: "news",
      });
    }
  }
});

router.get("/get-videos-by-category", async (req, res) => {
  const newsCategories = await Category.find({ type: "news" }).populate(
    "videos",
    "name path playedAt"
  );
  const musicCategories = await Category.find({ type: "music" }).populate(
    "videos",
    "name path playedAt"
  );
  const categories = { news: newsCategories, music: musicCategories };

  let formattedCategories = formatCategories(categories);

  res.json({
    success: true,
    categories: formattedCategories,
  });
});

function formatCategories(categories) {
  let formattedCategories = { news: {}, music: {} };

  // Process news
  for (let category of categories.news) {
    formattedCategories.news[category.name] = category.videos.map((video) => {
      return {
        name: video.name,
        path: video.path,
        playedAt: video.playedAt,
      };
    });
  }

  // Process music
  for (let category of categories.music) {
    formattedCategories.music[category.name] = category.videos.map((video) => {
      return {
        name: video.name,
        path: video.path,
        playedAt: video.playedAt,
      };
    });
  }

  return formattedCategories;
}

router.get("/update-video-playedAt/:id", async (req, res) => {
  const videoID = req.params.id;

  const ipAddress = req.headers["x-forwarded-for"];
  const userAgent = req.headers["user-agent"];
  const parseDeviceInfo = require("../../utils/parseDeviceInfo");
  const deviceInfo = parseDeviceInfo(userAgent);

  const video = await Video.findById(videoID).populate(["category"]);
  const trimReplace = require("../../utils/trimReplace");

  const newPlayLog = new PlayLog({
    video: video.name,
    category: video.category.name,
    ip: trimReplace(ipAddress),
    browser: deviceInfo.browser.name,
    os: `${deviceInfo.os.name} ${deviceInfo.os.version}`,
  });

  await newPlayLog.save();

  await Video.findByIdAndUpdate(
    videoID,
    {
      playedAt: new Date(),
    },
    { new: true }
  );

  res.json({
    success: true,
  });
});

router.get("/get-next-video/:id", async (req, res) => {
  const videoID = req.params.id;

  const currentVideo = await Video.findById(videoID);
  const currentCategory = await Category.findById(
    currentVideo.category
  ).populate(["videos"]);

  let _video;
  if (currentCategory.videos.length === 1) {
    _video = currentCategory.videos[0];
  } else {
    let sortedVideos = currentCategory.videos
      .filter((v) => String(v._id) !== videoID)
      .sort((v1, v2) => v1.playedAt - v2.playedAt);
    _video = sortedVideos[0];
  }

  res.json({
    success: true,
    video: _video,
  });
});

router.post("/update-channel/:id", async (req, res) => {
  res.json({
    success: true,
  });
});

router.delete("/delete-channel/:id", async (req, res) => {
  const channelID = req.params.id;
  const channel = await Channel.findById(channelID);

  try {
    // DELETE CHANNEL IMAGE
    fs.unlinkSync(channel.image);
    // DELETE CHANNEL VIDEOS
    channel.videos.forEach((video) => {
      fs.unlinkSync(video.path);
    });
  } catch (e) {
    console.log(e);
  }

  await Channel.findByIdAndDelete(channelID);

  res.json({
    success: true,
  });
});

router.get("/get-logs", async (req, res) => {
  const logs = await PlayLog.find().sort({ date: -1 }).limit(50);

  res.json({
    success: true,
    logs,
  });
});

router.get("/get-admin-logs", async (req, res) => {
  const ipAddress = req.headers["x-forwarded-for"];
  const logs = await PlayLog.find({ ip: ipAddress })
    .sort({ date: -1 })
    .limit(50);

  res.json({
    success: true,
    logs,
  });
});

module.exports = router;

const ruleForMusicMix = new schedule.RecurrenceRule();
ruleForMusicMix.hour = 0;
ruleForMusicMix.minute = 0;
ruleForMusicMix.second = 0;

const scheduleForScrape = schedule.scheduleJob(ruleForMusicMix, () => {
  const date = new Date();
  mixMusicSequence();
});

const mixMusicSequence = async () => {
  const musicCategories = await Category.find({ type: "music" });
  const today = new Date(); // Get current date
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(today.getDate() - 5);

  musicCategories.forEach(async (mc) => {
    mc.videos.forEach(async (videoID) => {
      const randomMilliseconds = Math.floor(
        Math.random() * (today.getTime() - fiveDaysAgo.getTime())
      );
      const randomDate = new Date(fiveDaysAgo.getTime() + randomMilliseconds);

      // const video = await Video.findById(videoID);
      const video = await Video.findByIdAndUpdate(
        videoID,
        {
          playedAt: randomDate,
        },
        { new: true }
      );
    });
  });
};
