const express = require("express");
const router = express.Router();

// DB MODEL
const Category = require("../../models/Category");
const Channel = require("../../models/Channel");
const Video = require("../../models/Video");

// FILE MANAGE
var fs = require("fs");
const path = require("path");
const createMulterInstance = require("../../utils/createMulterInstance");
const sanitize = require("../../utils/sanitize");

router.post("/create-category", async (req, res) => {
  let _existed = await Category.findOne({
    name: req.body.name,
    type: req.body.type,
  });
  if (_existed) {
    res.json({
      success: false,
      message: "Category name is already existed.",
    });
    return;
  }

  let dirPath = path.join("files", `/${req.body.type}`);

  if (fs.existsSync(dirPath)) {
    dirPath = path.join(
      dirPath,
      `/${req.body.name.toLowerCase().replace(" ", "_")}`
    );
    fs.mkdirSync(dirPath);
  } else {
    fs.mkdirSync(dirPath);
    dirPath = path.join(
      dirPath,
      `/${req.body.name.toLowerCase().replace(" ", "_")}`
    );
    fs.mkdirSync(dirPath);
  }

  let newCategory = new Category({
    name: req.body.name,
    path: dirPath,
    type: req.body.type,
  });

  await newCategory.save();

  res.json({
    success: true,
  });
});

router.post('/create-channel-category/:channelID', async (req, res) => {
  try {
    const channelID = req.params.channelID
    const channel = await Channel.findById(channelID)

    let _existed = await Category.findOne({
      channelID,
      name: req.body.name,
      type: req.body.type,
    });
    if (_existed) {
      res.json({
        success: false,
        message: "Category name is already existed.",
      });
      return;
    }
  
    let dirPath = path.join(channel.folder, `/${req.body.type}`);
  
    if (fs.existsSync(dirPath)) {
      dirPath = path.join(
        dirPath,
        `/${req.body.name.toLowerCase().replace(" ", "_")}`
      );
      fs.mkdirSync(dirPath);
    } else {
      fs.mkdirSync(dirPath);
      dirPath = path.join(
        dirPath,
        `/${req.body.name.toLowerCase().replace(" ", "_")}`
      );
      fs.mkdirSync(dirPath);
    }
  
    let newCategory = new Category({
      channelID,
      name: req.body.name,
      path: dirPath,
      type: req.body.type,
    });
  
    await newCategory.save();

    res.json({
      success: true
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
})

router.get("/get-categories", async (req, res) => {
  const categories = await Category.find();

  res.json({
    success: true,
    categories,
  });
});

router.get("/get-channel-categories/:channelID", async (req, res) => {
  const channelID = req.params.channelID;
  const categories = await Category.find({ channelID });

  res.json({
    success: true,
    categories,
  });
});

router.get("/get-category/:id", async (req, res) => {
  const categoryID = req.params.id;
  const category = await Category.findById(categoryID).populate(["videos"]);

  res.json({
    success: true,
    category,
  });
});

router.post("/update-category/:id", async (req, res) => {
  const categoryID = req.params.id;
  const _category = await Category.findById(categoryID);

  let _existed = await Category.findOne({
    name: req.body.name,
    type: req.body.type,
  });
  if (_existed) {
    res.json({
      success: false,
      message: "Category name is already existed.",
    });
    return;
  }

  let _dirPath = _category.path;
  let dirPath = `files/${req.body.type}/${req.body.name
    .toLowerCase()
    .replace(" ", "_")}`;
  fs.renameSync(_dirPath, dirPath);

  await Category.findByIdAndUpdate(
    categoryID,
    {
      name: req.body.name,
      type: req.body.type,
      path: dirPath,
    },
    { new: true }
  );

  const videosInCategory = await Video.find({ category: categoryID });
  videosInCategory.forEach(async (video) => {
    await Video.findByIdAndUpdate(video._id, {
      path: video.path.replace(_dirPath, dirPath),
    });
  });

  res.json({
    success: true,
  });
});

router.post('/update-channel-category/:id', async (req, res) => {
  try {
    const categoryID = req.params.id;
    const _category = await Category.findById(categoryID);
    const channel = await Channel.findById(_category.channelID)

    let _existed = await Category.findOne({
      channelID: _category.channelID,
      name: req.body.name,
      type: req.body.type,
    });

    if (_existed?._id) {
      res.json({
        success: false,
        message: "Category name is already existed.",
      });
      return;
    }
  
    let _dirPath = _category.path;
    let dirPath = path.join(channel.folder, `/${req.body.type}/${req.body.name.toLowerCase().replace(" ", "_")}`);
    fs.renameSync(_dirPath, dirPath);
  
    await Category.findByIdAndUpdate(
      categoryID,
      {
        name: req.body.name,
        type: req.body.type,
        path: dirPath,
      },
      { new: true }
    );
  
    const videosInCategory = await Video.find({ category: categoryID });
    videosInCategory.forEach(async (video) => {
      await Video.findByIdAndUpdate(video._id, {
        path: video.path.replace(_dirPath, dirPath),
      });
    });
  
    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
})

router.delete("/delete-category/:id", async (req, res) => {
  const categoryID = req.params.id;
  const category = await Category.findById(categoryID);

  try {
    fs.readdirSync(category.path).forEach((file, index) => {
      const curPath = category.path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(category.path);
  } catch (e) {
    try {
      fs.rmdirSync(category.path);
    } catch (err) {
      console.log(err);
    }
    console.log(e);
  }

  await Category.findByIdAndDelete(categoryID);
  await Video.deleteMany({ category: categoryID });

  res.json({
    success: true,
  });
});

router.delete("/delete-channel-category/:id", async (req, res) => {
  try {
    const categoryID = req.params.id;
    const category = await Category.findById(categoryID);
  
    try {
      fs.readdirSync(category.path).forEach((file, index) => {
        const curPath = category.path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(category.path);
    } catch (e) {
      try {
        fs.rmdirSync(category.path);
      } catch (err) {
        console.log(err.message);
      }
      console.log(e.message);
    }
  
    await Category.findByIdAndDelete(categoryID);
    await Video.deleteMany({ category: categoryID });
  
    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
})

router.post("/upload-video/:id", async (req, res) => {
  try {
    const categoryID = req.params.id;
    const category = await Category.findById(categoryID);
    let categoryVideos = category.videos;
  
    const fileUpload = createMulterInstance(category.path);
    await new Promise((resolve, reject) => {
      fileUpload.fields([{ name: "video", maxCount: 1 }])(req, res, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  
    let _video = req.files["video"][0];
  
    let newVideo = new Video({
      name: sanitize(_video.originalname),
      path: _video.path,
      category: categoryID,
    });
    await newVideo.save();
  
    categoryVideos.push(newVideo._id);
  
    await Category.findByIdAndUpdate(
      categoryID,
      {
        videos: categoryVideos,
      },
      { new: true }
    );
  
    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
});

router.post("/add-video-to-category", async (req, res) => {
  const categoryID = req.body.categoryID;
  const file = req.body.file;

  const _category = await Category.findById(categoryID);
  let _categoryVideos = _category.videos;
  const sourcePath = file.path;
  const destinationPath = `${_category.path}/${file.name}`;

  try {
    fs.renameSync(sourcePath, destinationPath);
    const newVideo = new Video({
      name: file.name,
      path: destinationPath,
      category: categoryID,
    });
    await newVideo.save();
    _categoryVideos.push(newVideo._id);
    await Category.findByIdAndUpdate(
      categoryID,
      {
        videos: _categoryVideos,
      },
      { new: true }
    );
  } catch (e) {
    console.log(e);
  }

  res.json({
    success: true,
  });
});

router.post("/remove-from-category", async (req, res) => {
  const categoryID = req.body.categoryID;
  const videoID = req.body.videoID;
  const category = await Category.findById(categoryID);
  const video = await Video.findById(videoID);

  const sourcePath = video.path;
  const destinationPath = `./files/temp/${video.name}`;

  try {
    fs.renameSync(sourcePath, destinationPath);
    await Video.findByIdAndDelete(videoID);
    const _videoIDs = category.videos.filter((id) => String(id) !== videoID);
    await Category.findByIdAndUpdate(
      categoryID,
      {
        videos: _videoIDs,
      },
      { new: true }
    );
  } catch (e) {
    console.log(e);
  }

  res.json({
    success: true,
  });
});

module.exports = router;
