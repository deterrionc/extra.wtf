const express = require('express');
const router = express.Router();

// DB MODEL
const Category = require('../../models/Category');
const Video = require('../../models/Video');

// FILE MANAGE
var fs = require('fs');
const path = require('path');

router.post('/create-category', async (req, res) => {
  let _existed = await Category.findOne({
    name: req.body.name,
    type: req.body.type
  });
  if (_existed) {
    res.json({
      success: false,
      message: 'Category name is already existed.'
    });
    return;
  }

  let dirPath = path.join('files', `/${req.body.type}`);

  if (fs.existsSync(dirPath)) {
    dirPath = path.join(
      dirPath,
      `/${req.body.name.toLowerCase().replace(' ', '_')}`
    );
    fs.mkdirSync(dirPath);
  } else {
    fs.mkdirSync(dirPath);
    dirPath = path.join(
      dirPath,
      `/${req.body.name.toLowerCase().replace(' ', '_')}`
    );
    fs.mkdirSync(dirPath);
  }

  let newCategory = new Category({
    name: req.body.name,
    path: dirPath,
    type: req.body.type
  });

  await newCategory.save();

  res.json({
    success: true
  });
});

router.get('/get-categories', async (req, res) => {
  const categories = await Category.find();

  res.json({
    success: true,
    categories
  });
});

router.get('/get-category/:id', async (req, res) => {
  const categoryID = req.params.id;
  const category = await Category.findById(categoryID).populate(['videos']);

  res.json({
    success: true,
    category
  });
});

router.post('/update-category/:id', async (req, res) => {
  const categoryID = req.params.id;
  const _category = await Category.findById(categoryID);

  let _existed = await Category.findOne({
    name: req.body.name,
    type: req.body.type
  });
  if (_existed) {
    res.json({
      success: false,
      message: 'Category name is already existed.'
    });
    return;
  }

  let _dirPath = _category.path;
  let dirPath = `files/${req.body.type}/${req.body.name
    .toLowerCase()
    .replace(' ', '_')}`;
  fs.renameSync(_dirPath, dirPath);

  await Category.findByIdAndUpdate(
    categoryID,
    {
      name: req.body.name,
      type: req.body.type,
      path: dirPath
    },
    { new: true }
  );

  res.json({
    success: true
  });
});

router.delete('/delete-category/:id', async (req, res) => {
  const categoryID = req.params.id;
  const category = await Category.findById(categoryID);

  try {
    fs.readdirSync(category.path).forEach((file, index) => {
      const curPath = category.path + '/' + file;
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

  res.json({
    success: true
  });
});

router.post('/add-video-to-category', async (req, res) => {
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
      category: categoryID
    });
    await newVideo.save();
    _categoryVideos.push(newVideo._id);
    await Category.findByIdAndUpdate(
      categoryID,
      {
        videos: _categoryVideos
      },
      { new: true }
    );
  } catch (e) {
    console.log(e);
  }

  res.json({
    success: true
  });
});

module.exports = router;
