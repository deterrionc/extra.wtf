const express = require('express');
const router = express.Router();

// DB MODEL
const Channel = require('../../models/Channel');
const Video = require('../../models/Video');

// FILE UPLOAD
const fileUpload = require('../../utils/fileUpload');

// FILE DELETE
var fs = require('fs');

router.post(
  '/create-channel',
  fileUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'videos' }]),
  async (req, res) => {
    let imagePath = req.files['image'][0].path;
    let videos = req.files['videos'];
    let _videos = [];

    let newChannel = new Channel({
      name: req.body.name,
      image: imagePath
    });

    for (let i = 0; i < videos.length; i++) {
      let newVideo = new Video({
        name: videos[i].originalname,
        path: videos[i].path,
        channel: newChannel._id
      });
      await newVideo.save();
      _videos.push(newVideo._id);
    }

    newChannel.videos = _videos;

    await newChannel.save();

    res.json({
      success: true
    });
  }
);

router.get('/get-channels', async (req, res) => {
  const channels = await Channel.find().populate(['videos'])

  res.json({
    success: true,
    channels
  });
});

router.get('/get-channel/:id', async (req, res) => {
  const channelID = req.params.id
  const channel = await Channel.findById(channelID).populate(['videos'])

  res.json({
    success: true,
    channel
  });
});

router.post('/update-channel/:id', async (req, res) => {
  res.json({
    success: true
  });
});

router.delete('/delete-channel/:id', async (req, res) => {
  const channelID = req.params.id
  const channel = await Channel.findById(channelID).populate(['videos'])

  try {
    // DELETE CHANNEL IMAGE
    fs.unlinkSync(channel.image)
    // DELETE CHANNEL VIDEOS
    channel.videos.forEach(video => {
      fs.unlinkSync(video.path)
    })
  } catch (e) {
    console.log(e)
  }

  await Channel.findByIdAndDelete(channelID)

  res.json({
    success: true
  });
});

module.exports = router;
