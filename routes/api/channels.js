const express = require('express');
const router = express.Router();

// DB MODEL
const Channel = require('../../models/Channel');
const Video = require('../../models/Video');

// FILE UPLOAD
const fileUpload = require('../../utils/fileUpload');

// FILE DELETE
var fs = require('fs');
const Category = require('../../models/Category');
// const getVideoDuration = require('../../utils/getVideoDuration');

router.post(
  '/create-channel',
  // fileUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'videos' }]),
  fileUpload.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res) => {
    let imagePath = req.files['image'][0].path;
    // let videos = req.files['videos'];
    // let _videos = [];

    let newChannel = new Channel({
      name: req.body.name,
      image: imagePath
    });

    // for (let i = 0; i < videos.length; i++) {
    //   let newVideo = new Video({
    //     name: videos[i].originalname,
    //     path: videos[i].path,
    //     channel: newChannel._id
    //   });
    //   await newVideo.save();
    //   _videos.push(newVideo._id);
    // }

    // newChannel.videos = _videos;

    await newChannel.save();

    res.json({
      success: true
    });
  }
);

router.get('/get-channels', async (req, res) => {
  // const channels = await Channel.find().populate(['videos']);
  const channels = await Channel.find();

  res.json({
    success: true,
    channels
  });
});

router.get('/get-channel/:id', async (req, res) => {
  const channelID = req.params.id;
  // const channel = await Channel.findById(channelID).populate(['videos']);
  const channel = await Channel.findById(channelID);

  res.json({
    success: true,
    channel
  });
});

router.get('/get-channel-videos', async (req, res) => {
  let currentTime = new Date();
  let currentMinute = currentTime.getMinutes();
  let currentHour = currentTime.getHours();
  let currentSecond = currentTime.getSeconds();
  let _videos = [];

  if (currentHour >= 6 && currentHour <= 18) {
    // Day time
    if (currentMinute % 30 >= 25) {
      // Before 5 min
      if (currentMinute % 30 >= 28) {
        // Before 2 min
        const _music_short = await Category.findOne({
          name: 'music_short'
        }).populate(['videos']);
        let temp_videos = _music_short.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(temp_videos[0]);

        res.json({
          success: true,
          videos: _videos,
          currentMinute,
          currentSecond,
          currentCategory: 'music_short'
        });
      } else {
        const _music_short = await Category.findOne({
          name: 'music_short'
        }).populate(['videos']);
        let temp_videos = _music_short.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(temp_videos[0]);

        res.json({
          success: true,
          videos: _videos,
          currentMinute,
          currentSecond,
          currentCategory: 'music_short'
        });
      }
    } else if (currentMinute % 30 >= 0) {
      if (currentMinute % 30 >= 5) {
        // Return Music
        const _music_long = await Category.findOne({
          name: 'music_long'
        }).populate(['videos']);
        let temp_videos = _music_long.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(temp_videos[0]);

        res.json({
          success: true,
          videos: _videos,
          currentMinute,
          currentSecond,
          currentCategory: 'music_long'
        });
      } else {
        // Return News
        const _jingle_nat = await Category.findOne({
          name: 'jingle_nat'
        }).populate(['videos']);
        let _jingle_nat_videos = _jingle_nat.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(_jingle_nat_videos[0]);

        const _news_nat = await Category.findOne({ name: 'news_nat' }).populate(
          ['videos']
        );
        let _news_nat_videos = _news_nat.videos
          .sort((v1, v2) => v1.playedAt - v2.playedAt)
          .slice(0, 3);
        _news_nat_videos.forEach((v) => _videos.push(v));

        const _jingle_int = await Category.findOne({
          name: 'jingle_int'
        }).populate(['videos']);
        let _jingle_int_videos = _jingle_int.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(_jingle_int_videos[0]);

        const _news_int = await Category.findOne({ name: 'news_int' }).populate(
          ['videos']
        );
        let _news_int_videos = _news_int.videos
          .sort((v1, v2) => v1.playedAt - v2.playedAt)
          .slice(0, 3);
        _news_int_videos.forEach((v) => _videos.push(v));

        console.log("---------------")
        _videos.forEach(v => console.log(v.name))
        console.log("---------------")

        res.json({
          success: true,
          videos: _videos,
          currentMinute,
          currentSecond,
          currentCategory: 'news'
        });
      }
    }
  } else {
    // Night Time
    if (currentMinute % 60 >= 55) {
      // Before 5 min
      if (currentMinute % 60 >= 58) {
        // Before 2 min
        const _music_short = await Category.findOne({
          name: 'music_short'
        }).populate(['videos']);
        let temp_videos = _music_short.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(temp_videos[0]);

        res.json({
          success: true,
          videos: _videos,
          currentMinute,
          currentSecond,
          currentCategory: 'music_short'
        });
      } else {
        const _music_short = await Category.findOne({
          name: 'music_short'
        }).populate(['videos']);
        let temp_videos = _music_short.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(temp_videos[0]);

        res.json({
          success: true,
          videos: _videos,
          currentMinute,
          currentSecond,
          currentCategory: 'music_short'
        });
      }
    } else if (currentMinute % 60 >= 0) {
      if (currentMinute % 60 >= 5) {
        // Return Music
        const _music_long = await Category.findOne({
          name: 'music_long'
        }).populate(['videos']);
        let temp_videos = _music_long.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(temp_videos[0]);

        res.json({
          success: true,
          videos: _videos,
          currentMinute,
          currentSecond,
          currentCategory: 'music_long'
        });
      } else {
        // Return News
        const _jingle_nat = await Category.findOne({
          name: 'jingle_nat'
        }).populate(['videos']);
        let _jingle_nat_videos = _jingle_nat.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(_jingle_nat_videos[0]);

        const _news_nat = await Category.findOne({ name: 'news_nat' }).populate(
          ['videos']
        );
        let _news_nat_videos = _news_nat.videos
          .sort((v1, v2) => v1.playedAt - v2.playedAt)
          .slice(0, 3);
        _news_nat_videos.forEach((v) => _videos.push(v));

        const _jingle_int = await Category.findOne({
          name: 'jingle_int'
        }).populate(['videos']);
        let _jingle_int_videos = _jingle_int.videos.sort(
          (v1, v2) => v1.playedAt - v2.playedAt
        );
        _videos.push(_jingle_int_videos[0]);

        const _news_int = await Category.findOne({ name: 'news_int' }).populate(
          ['videos']
        );
        let _news_int_videos = _news_int.videos
          .sort((v1, v2) => v1.playedAt - v2.playedAt)
          .slice(0, 3);
        _news_int_videos.forEach((v) => _videos.push(v));

        res.json({
          success: true,
          videos: _videos,
          currentMinute,
          currentSecond,
          currentCategory: 'news'
        });
      }
    }
  }
});

router.get('/update-video-playedAt/:id', async (req, res) => {
  const videoID = req.params.id;

  console.log(videoID);

  await Video.findByIdAndUpdate(
    videoID,
    {
      playedAt: new Date()
    },
    { new: true }
  );

  let video = await Video.findById(videoID);
  let category = await Category.findById(video.category).populate(['videos']);
  let videos = category.videos.sort((v1, v2) => v1.playedAt - v2.playedAt);
  videos.forEach((v) => {
    console.log(v.name);
  });

  res.json({
    success: true
  });
});

router.get('/get-next-video/:id', async (req, res) => {
  const videoID = req.params.id;
  console.log(videoID);

  const currentVideo = await Video.findById(videoID);
  const currentCategory = await Category.findById(
    currentVideo.category
  ).populate(['videos']);

  // console.log(currentCategory)
  let _video;
  if (currentCategory.videos.length === 1) {
    _video = currentCategory.videos[0];
  } else {
    let sortedVideos = currentCategory.videos
      .filter((v) => String(v._id) !== videoID)
      .sort((v1, v2) => v1.playedAt - v2.playedAt);
    // console.log(sortedVideos)
    _video = sortedVideos[0];
  }

  res.json({
    success: true,
    video: _video
  });
});

router.post('/update-channel/:id', async (req, res) => {
  res.json({
    success: true
  });
});

router.delete('/delete-channel/:id', async (req, res) => {
  const channelID = req.params.id;
  // const channel = await Channel.findById(channelID).populate(['videos']);
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
    success: true
  });
});

module.exports = router;
