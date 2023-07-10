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

    const convertToSlug = require("../../utils/convertToSlug");

    let slug = convertToSlug(req.body.name);

    while (true) {
      let _channel = await Channel.findOne({ slug });
      if (_channel) {
        slug += "_";
      } else {
        break;
      }
    }

    let newChannel = new Channel({
      name: req.body.name,
      slug,
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

router.get("/get-channel-by-slug/:slug", async (req, res) => {
  const slug = req.params.slug;
  const channel = await Channel.findOne({slug});

  res.json({
    success: true,
    channel,
  });
});


router.post(
  "/update-channel/:id",
  fileUpload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const channelID = req.params.id;
    let imagePath = req.files["image"][0].path;

    const convertToSlug = require("../../utils/convertToSlug");

    let slug = convertToSlug(req.body.name);

    while (true) {
      let _channel = await Channel.findOne({ slug });
      if (_channel) {
        slug += "_";
      } else {
        break;
      }
    }

    // DELETE ATTACHED IMAGE
    const channel = await Channel.findById(channelID)
    fs.unlinkSync(channel.image);

    await Channel.findByIdAndUpdate(
      channelID,
      {
        name: req.body.name,
        slug,
        image: imagePath,
      },
      { new: true }
    );

    res.json({
      success: true,
    });
  }
);

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

router.get("/get-channel-videos", async (req, res) => {
  console.log(`${new Date()} GET CHANNEL VIDEOS`)
  let currentTime = new Date();
  let currentMinute = currentTime.getMinutes();
  let currentHour = currentTime.getHours();
  let currentSecond = currentTime.getSeconds();
  let currentCategory = "music";
  let videos = [];

  if (currentHour >= 6 && currentHour <= 18) {
    // Day time
    if (currentMinute % 30 >= 5) {
      videos = await getMusicVideos(videos);
    } else {
      videos = await getNewsVideos(videos, "day");
      currentCategory = "news";
    }
  } else {
    // Night Time
    if (currentMinute % 60 >= 5) {
      videos = await getMusicVideos(videos);
    } else {
      videos = await getNewsVideos(videos, "night");
      currentCategory = "news";
    }
  }

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
  console.log(`${new Date()} GET NEXT VIDEO`)
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

const getNewsVideos = async (videos, time) => {
  const jingle_nat = await Category.findOne({ name: "jingle_nat" }).populate(
    "videos"
  );
  let jingle_nat_videos = jingle_nat.videos.sort(
    (v1, v2) => v1.playedAt - v2.playedAt
  );
  videos.push(jingle_nat_videos[0]);

  const news_nat = await Category.findOne({ name: "news_nat" }).populate(
    "videos"
  );
  let news_nat_videos = news_nat.videos
    .sort((v1, v2) => v1.playedAt - v2.playedAt)
    .slice(0, 3);
  news_nat_videos.forEach((v) => videos.push(v));

  const jingle_int = await Category.findOne({ name: "jingle_int" }).populate(
    "videos"
  );
  let jingle_int_videos = jingle_int.videos.sort(
    (v1, v2) => v1.playedAt - v2.playedAt
  );
  videos.push(jingle_int_videos[0]);

  const news_int = await Category.findOne({ name: "news_int" }).populate(
    "videos"
  );
  let news_int_videos = news_int.videos
    .sort((v1, v2) => v1.playedAt - v2.playedAt)
    .slice(0, 3);
  news_int_videos.forEach((v) => videos.push(v));

  if (time === "day") {
    const next_news_30 = await Category.findOne({
      name: "next_news_30",
    }).populate("videos");
    let next_news_30_videos = next_news_30.videos
      .sort((v1, v2) => v1.playedAt - v2.playedAt)
      .slice(0, 3);
    next_news_30_videos.forEach((v) => videos.push(v));
  } else {
    const next_news_60 = await Category.findOne({
      name: "next_news_60",
    }).populate("videos");
    let next_news_60_videos = next_news_60.videos
      .sort((v1, v2) => v1.playedAt - v2.playedAt)
      .slice(0, 3);
    next_news_60_videos.forEach((v) => videos.push(v));
  }

  let musics = [];
  musics = await getMusicVideos(musics);

  musics.forEach((m) => {
    videos.push(m);
  });

  videos = videos.slice(0, 14);

  return videos;
};

const getMusicVideos = async (videos) => {
  const musicCategories = await Category.find({ type: "music" }).populate(
    "videos"
  );
  musicCategories.forEach((mc) => {
    mc.videos.forEach((v) => {
      videos.push(v);
    });
  });
  videos = videos.sort((v1, v2) => v1.playedAt - v2.playedAt).slice(0, 14);

  return videos;
};
