const express = require("express");
const router = express.Router();

// DB MODEL
const Channel = require("../../models/Channel");
const Video = require("../../models/Video");
const PlayLog = require("../../models/PlayLog");

// FILE UPLOAD
const fileUpload = require("../../utils/fileUpload");
const createMulterInstance = require("../../utils/createMulterInstance");

// FILE DELETE
var fs = require("fs");
const path = require("path");
const Category = require("../../models/Category");
// const getVideoDuration = require('../../utils/getVideoDuration');

// For Scheduling
const schedule = require("node-schedule");

let serverNews;
let serverMusics;

router.post("/create-channel/:folder", async (req, res) => {
  let dirPath = path.join("files", `/${req.params.folder}`);

  try {
    fs.mkdirSync(dirPath);
    const imageUpload = createMulterInstance(dirPath);

    await new Promise((resolve, reject) => {
      imageUpload.fields([{ name: "image", maxCount: 1 }])(req, res, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    let imagePath = req.files["image"][0].path;

    let newChannel = new Channel({
      name: req.body.name,
      slug: req.body.slug,
      folder: dirPath,
      image: imagePath,
    });

    await newChannel.save();

    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
});

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

router.get("/get-channel-by-slug/:slug", async (req, res) => {
  const slug = req.params.slug;
  const channel = await Channel.findOne({ slug });

  res.json({
    success: true,
    channel,
  });
});

router.post("/update-channel/:id", async (req, res) => {
  const channelID = req.params.id;

  try {
    // DELETE ATTACHED IMAGE
    const channel = await Channel.findById(channelID);
    fs.unlinkSync(channel.image);

    const imageUpload = createMulterInstance(channel.folder);

    await new Promise((resolve, reject) => {
      imageUpload.fields([{ name: "image", maxCount: 1 }])(req, res, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    let imagePath = req.files["image"][0].path;
  
    await Channel.findByIdAndUpdate(
      channelID,
      {
        name: req.body.name,
        slug: req.body.slug,
        image: imagePath,
      },
      { new: true }
    );
  
    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
});

router.delete("/delete-channel/:id", async (req, res) => {
  const channelID = req.params.id;
  const channel = await Channel.findById(channelID);

  try {
    // DELETE CHANNEL IMAGE
    fs.unlinkSync(channel.image);
  } catch (e) {
    console.log(e);
  }

  await Channel.findByIdAndDelete(channelID);

  res.json({
    success: true,
  });
});

router.get("/get-channel-videos/:channelID", async (req, res) => {
  let channelID = req.params.channelID
  let currentTime = new Date();
  // console.log(
  //   `${currentTime.getMonth()}/${currentTime.getDate()} ${currentTime.getHours()}-${currentTime.getMinutes()}-${currentTime.getSeconds()} GET CHANNEL VIDEOS`
  // );
  let currentMinute = currentTime.getMinutes();
  let currentHour = currentTime.getHours();
  let currentSecond = currentTime.getSeconds();
  let currentCategory = "music";
  let videos = [];

  if (currentHour >= 6 && currentHour <= 18) {
    // Day time
    if (currentMinute % 30 >= 5) {
      let _videos = await getMusicVideos();
      videos = _videos[channelID]
    } else {
      let _videos = await getNewsVideos("day");
      videos = _videos[channelID]
      videoType = "news";
    }
  } else {
    // Night Time
    if (currentMinute % 60 >= 5) {
      let _videos = videos = await getMusicVideos();
      videos = _videos[channelID]
    } else {
      let _videos = await getNewsVideos("night");
      videos = _videos[channelID]
      videoType = "news";
    }
  }

  videos = videos.slice(0, 15);

  res.json({
    success: true,
    videos,
    currentMinute,
    currentSecond,
    currentCategory,
  });
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

router.get("/update-video-playedAt", async (req, res) => {
  const videoID = req.query.videoID
  const slug = req.query.slug
  const channel = await Channel.findOne({slug})
  const channelID = channel._id

  const ipAddress = req.headers["x-forwarded-for"];
  const userAgent = req.headers["user-agent"];
  const parseDeviceInfo = require("../../utils/parseDeviceInfo");
  const deviceInfo = parseDeviceInfo(userAgent);

  const video = await Video.findById(videoID).populate(["category"]);
  const trimReplace = require("../../utils/trimReplace");

  const newPlayLog = new PlayLog({
    video: video.name,
    category: video.category.name,
    channelID,
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

router.get("/get-next-video-old/:id", async (req, res) => {
  let currentTime = new Date();
  // console.log(
  //   `${currentTime.getMonth()}/${currentTime.getDate()} ${currentTime.getHours()}-${currentTime.getMinutes()}-${currentTime.getSeconds()} GET NEXT VIDEO`
  // );
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

router.get("/get-logs/:channelID", async (req, res) => {
  const channelID = req.params.channelID
  const logs = await PlayLog.find({channelID}).sort({ date: -1 }).limit(50);

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

router.post("/get-ip-filtered-logs", async (req, res) => {
  const ip = req.body.ip;
  const channelID = req.body.channelID;

  let logs = await PlayLog.find({channelID}).sort({ date: -1 });
  logs = logs.filter((log) => log.ip.includes(ip)).slice(0, 50);

  res.json({
    success: true,
    logs,
  });
});

router.get("/get-first-video/:slug", async (req, res) => {
  let slug = req.params.slug
  let channel = await Channel.findOne({slug})
  let channelID = channel._id
  let currentTime = new Date();
  let currentMinute = currentTime.getMinutes();
  let currentHour = currentTime.getHours();
  let currentSecond = currentTime.getSeconds();
  let videos = [];
  let videoType = "music";

  if (currentHour >= 6 && currentHour <= 18) {
    // Day time
    if (currentMinute % 30 >= 5) {
      let _videos = await getMusicVideos();
      videos = _videos[channelID]
    } else {
      let _videos = await getNewsVideos("day");
      videos = _videos[channelID]
      videoType = "news";
    }
  } else {
    // Night Time
    if (currentMinute % 60 >= 5) {
      let _videos = videos = await getMusicVideos();
      videos = _videos[channelID]
    } else {
      let _videos = await getNewsVideos("night");
      videos = _videos[channelID]
      videoType = "news";
    }
  }

  let video = {
    ...videos[0],
    type: videoType,
  };

  res.json({
    success: true,
    video,
    currentMinute,
    currentSecond,
  });
});

router.get("/get-next-video", async (req, res) => {
  const slug = req.query.slug;
  const channel = await Channel.findOne({slug})
  const channelID = channel._id
  const videoID = req.query.videoID;
  const videoType = req.query.type;
  let video = null;

  if (videoType === "music") {
    const videoIndex = serverMusics[channelID].findIndex((v) => String(v._id) === videoID);
    if (videoIndex < serverMusics[channelID].length - 1) {
      video = serverMusics[channelID][videoIndex + 1];
    } else {
      video = serverMusics[channelID][0];
    }
  }

  if (videoType === "news") {
    if (videoID === 0) {
      video = serverNews[channelID][0];
    }
    const videoIndex = serverNews[channelID].findIndex((v) => String(v._id) === videoID);
    if (videoIndex < serverNews[channelID].length - 1) {
      video = serverNews[channelID][videoIndex + 1];
    } else {
      video = serverMusics[channelID][0];
    }
  }

  res.json({
    success: true,
    video,
  });
});

module.exports = router;

const ruleForMusicMix = new schedule.RecurrenceRule();
ruleForMusicMix.hour = 23;
ruleForMusicMix.minute = 58;
ruleForMusicMix.second = 0;

const scheduleForMusicMix = schedule.scheduleJob(ruleForMusicMix, () => {
  mixMusicSequence();
  prepare_News_Musics();
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

const getNewsVideos = async (time) => {
  let videosObj = {}

  const channels = await Channel.find()
  for (let i = 0; i < channels.length; i++) {
    let ch = channels[i]
    const category = await Category.findOne({channelID: ch._id})
    if (category) {
      let videos = [];
      const jingle_nat = await Category.findOne({ name: "jingle_nat", channelID: ch._id }).populate("videos");
      let jingle_nat_videos = jingle_nat.videos.sort((v1, v2) => v1.playedAt - v2.playedAt);
      videos.push(jingle_nat_videos[0]);
    
      const news_nat = await Category.findOne({ name: "news_nat", channelID: ch._id }).populate("videos");
      let news_nat_videos = news_nat.videos.sort((v1, v2) => v1.playedAt - v2.playedAt).slice(0, 3);
      news_nat_videos.forEach((v) => videos.push(v));
    
      const jingle_int = await Category.findOne({ name: "jingle_int", channelID: ch._id }).populate("videos");
      let jingle_int_videos = jingle_int.videos.sort((v1, v2) => v1.playedAt - v2.playedAt);
      videos.push(jingle_int_videos[0]);
    
      const news_int = await Category.findOne({ name: "news_int", channelID: ch._id }).populate("videos");
      let news_int_videos = news_int.videos.sort((v1, v2) => v1.playedAt - v2.playedAt).slice(0, 3);
      news_int_videos.forEach((v) => videos.push(v));
    
      if (time === "day") {
        const next_news_30 = await Category.findOne({name: "next_news_30", channelID: ch._id}).populate("videos");
        let next_news_30_videos = next_news_30.videos.sort((v1, v2) => v1.playedAt - v2.playedAt).slice(0, 3);
        next_news_30_videos.forEach((v) => videos.push(v));
      } else {
        const next_news_60 = await Category.findOne({name: "next_news_60", channelID: ch._id}).populate("videos");
        let next_news_60_videos = next_news_60.videos.sort((v1, v2) => v1.playedAt - v2.playedAt).slice(0, 3);
        next_news_60_videos.forEach((v) => videos.push(v));
      }
    
      let _videos = [];
      videos.forEach((v) => {
        _videos.push({ ...v._doc, type: "news" });
      });
      videos = _videos;

      let musics = [];
      musics = await getMusicVideos();

      musics[ch._id].forEach((m) => {
        videos.push(m);
      });

      videosObj[ch._id] = videos
    }
  }

  return videosObj;
};

const getMusicVideos = async () => {

  let videosObj = {}

  const channels = await Channel.find()
  for (let i = 0; i < channels.length; i++) {
    let ch = channels[i]
    const category = await Category.findOne({channelID: ch._id})
    if (category) {
      let videos = [];
      const musicCategories = await Category.find({ type: "music", channelID: ch._id }).populate("videos");
      musicCategories.forEach((mc) => {
        mc.videos.forEach((v) => {
          videos.push({ ...v._doc, type: "music" });
        });
      });
      videos = videos.sort((v1, v2) => v1.playedAt - v2.playedAt);

      videosObj[ch._id] = videos
    }
  }

  return videosObj;
};

const prepare_News_Musics = async () => {
  serverNews = await getNewsVideos();
  serverMusics = await getMusicVideos();
};

prepare_News_Musics();

const ruleForPrepareServerList1 = new schedule.RecurrenceRule();
ruleForPrepareServerList1.minute = 29;
ruleForPrepareServerList1.second = 0;

const scheduleForPrepareServerList1 = schedule.scheduleJob(
  ruleForPrepareServerList1,
  () => {
    prepare_News_Musics();
  }
);

const ruleForPrepareServerList2 = new schedule.RecurrenceRule();
ruleForPrepareServerList2.minute = 59;
ruleForPrepareServerList2.second = 0;

const scheduleForPrepareServerList2 = schedule.scheduleJob(
  ruleForPrepareServerList2,
  () => {
    prepare_News_Musics();
  }
);
