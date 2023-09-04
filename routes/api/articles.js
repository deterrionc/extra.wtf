const express = require("express");
const router = express.Router();

// FILE DELETE
var fs = require("fs");
var path = require("path");

// FILE UPLOAD
const createMulterInstance = require("../../utils/createMulterInstance");
const getCurrentTimeFilePath = require("../../utils/getCurrentTimeFilePath");

router.post("/create-article", async (req, res) => {
  let dirPath = path.join("../carl/upload/articles", getCurrentTimeFilePath());

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

    let imageName = req.files["image"][0].filename;

    const articleData = {
      topic: req.body.topic || "",
      title: req.body.title || "",
      description: req.body.description || "",
      link: req.body.link || "",
      image: imageName || ""
    };

    const articleJsonPath = path.join(dirPath, 'article.json');
    fs.writeFileSync(articleJsonPath, JSON.stringify(articleData, null, 2));

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

router.get("/get-articles", async (req, res) => {
  try {
    let dirPath = "../carl/upload/articles"
    let articleDirs = fs.readdirSync(dirPath);

    let articles = [];

    articleDirs.forEach((dir) => {
      let articlePath = path.join(dirPath, dir, 'article.json');
      if (fs.existsSync(articlePath)) {
        let articleData = fs.readFileSync(articlePath, 'utf8');
        let article = JSON.parse(articleData);
        article.path = "/upload/articles/" + dir;
        articles.push(article);
      }
    });

    res.json({
      success: true,
      articles: articles
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: err.message
    });
  }
});

router.get("/get-article/:id", async (req, res) => {
  res.json({
    success: true,
  });
});

router.delete("/delete-article/:id", async (req, res) => {
  res.json({
    success: true,
  });
});

module.exports = router;
