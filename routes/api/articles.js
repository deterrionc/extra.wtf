const express = require("express")
const router = express.Router()
const config = require('config')

// FILE DELETE
var fs = require("fs")
var path = require("path")
var dirPath = path.join(config.get('uploadDirectory'), "articles")

// FILE UPLOAD
const createMulterInstance = require("../../utils/createMulterInstance")
const getCurrentTimeFilePath = require("../../utils/getCurrentTimeFilePath")

router.post("/create-article", async (req, res) => {
  let uploadPath = path.join(dirPath, getCurrentTimeFilePath())

  try {
    fs.mkdirSync(uploadPath)
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

    const articleData = {
      topic: req.body.topic || "",
      title: req.body.title || "",
      description: req.body.description || "",
      link: req.body.link || "",
      image: imageName || ""
    }

    const articleJsonPath = path.join(uploadPath, 'article.json')
    fs.writeFileSync(articleJsonPath, JSON.stringify(articleData, null, 2))

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

router.get("/get-articles", async (req, res) => {
  try {
    let articleDirs = fs.readdirSync(dirPath)

    let articles = []

    articleDirs.forEach((dir) => {
      let articlePath = path.join(dirPath, dir, 'article.json')
      if (fs.existsSync(articlePath)) {
        let articleData = fs.readFileSync(articlePath, 'utf8')
        let article = JSON.parse(articleData)
        article.path = "upload/articles/" + dir
        article.id = dir
        articles.push(article)
      }
    })

    res.json({
      success: true,
      articles: articles
    })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: err.message
    })
  }
})

router.get("/get-article/:id", async (req, res) => {
  const articleId = req.params.id
  const articlePath = path.join(dirPath, articleId)

  // Check if folder exists
  if (fs.existsSync(articlePath)) {
    const jsonFilePath = path.join(articlePath, 'article.json')
    
    // Check if article.json exists
    if (fs.existsSync(jsonFilePath)) {
      try {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
        let article = JSON.parse(jsonData)
        article.path = "upload/articles/" + articleId
        article.id = articleId
        res.json({
          success: true,
          article
        })
      } catch (err) {
        res.json({
          success: false,
          message: `Error reading article.json: ${err.message}`,
        })
      }
    } else {
      res.json({
        success: false,
        message: 'article.json not found',
      })
    }
  } else {
    res.json({
      success: false,
      message: 'Folder not found',
    })
  }
})

router.post("/update-article/:id", async (req, res) => {
  const articleId = req.params.id
  const articlePath = path.join(dirPath, articleId)
  const jsonFilePath = path.join(articlePath, 'article.json')
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
  let article = JSON.parse(jsonData)
  article.topic = req.body.topic
  article.title = req.body.title
  article.description = req.body.description
  article.link = req.body.link
  fs.writeFileSync(jsonFilePath, JSON.stringify(article, null, 2))

  res.json({
    success: true
  })
})

router.post("/update-article-with-image/:id", async (req, res) => {
  const articleId = req.params.id
  let articlePath = path.join(dirPath, articleId)
  const jsonFilePath = path.join(articlePath, 'article.json')
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
  let article = JSON.parse(jsonData)

  const imageUpload = createMulterInstance(articlePath)
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

  const oldImagePath = path.join(articlePath, article.image);
  fs.unlink(oldImagePath, (err) => {
    if (err) {
      console.error(`Failed to delete old image: ${err}`);
    } else {
      console.log('Successfully deleted the old image.');
    }
  });

  article.topic = req.body.topic
  article.title = req.body.title
  article.description = req.body.description
  article.link = req.body.link
  article.image = imageName

  fs.writeFileSync(jsonFilePath, JSON.stringify(article, null, 2))

  res.json({
    success: true
  })
})

router.delete("/delete-article/:id", (req, res) => {
  const deletePath = path.join(dirPath, req.params.id)

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


module.exports = router
