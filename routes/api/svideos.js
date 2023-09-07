const express = require("express")
const router = express.Router()
const config = require('config')

// FILE DELETE
var fs = require("fs")
var path = require("path")
var dirPath = path.join(config.get('uploadDirectory'), "videos")

// FILE UPLOAD
const createMulterInstance = require("../../utils/createMulterInstance")
const getCurrentTimeFilePath = require("../../utils/getCurrentTimeFilePath")

router.post("/create-svideo", async (req, res) => {
  let uploadPath = path.join(dirPath, getCurrentTimeFilePath())

  try {
    fs.mkdirSync(uploadPath)
    const fileUpload = createMulterInstance(uploadPath)

    await new Promise((resolve, reject) => {
      fileUpload.fields([
        { name: "image", maxCount: 1 }, 
        { name: "video", maxCount: 1 }
      ])(req, res, (err) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve();
      });
    });

    let imageName = req.files["image"][0].filename
    let videoName = req.files["video"][0].filename

    const svideoData = {
      title: req.body.title || "",
      image: imageName || "",
      video: videoName || ""
    }

    const svideoJsonPath = path.join(uploadPath, 'video.json')
    fs.writeFileSync(svideoJsonPath, JSON.stringify(svideoData, null, 2))

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

router.get("/get-svideos", async (req, res) => {
  try {
    let svideoDirs = fs.readdirSync(dirPath)

    let svideos = []

    svideoDirs.forEach((dir) => {
      let svideoPath = path.join(dirPath, dir, 'video.json')
      if (fs.existsSync(svideoPath)) {
        let svideoData = fs.readFileSync(svideoPath, 'utf8')
        let svideo = JSON.parse(svideoData)
        svideo.path = "upload/videos/" + dir
        svideo.id = dir
        svideos.push(svideo)
      }
    })

    res.json({
      success: true,
      svideos: svideos
    })
  } catch (err) {
    console.error(err)
    res.json({
      success: false,
      message: err.message
    })
  }
})

router.get("/get-svideo/:id", async (req, res) => {
  const svideoId = req.params.id
  const svideoPath = path.join(dirPath, svideoId)

  // Check if folder exists
  if (fs.existsSync(svideoPath)) {
    const jsonFilePath = path.join(svideoPath, 'video.json')
    
    // Check if svideo.json exists
    if (fs.existsSync(jsonFilePath)) {
      try {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
        let svideo = JSON.parse(jsonData)
        svideo.path = "upload/videos/" + svideoId
        svideo.id = svideoId
        res.json({
          success: true,
          svideo
        })
      } catch (err) {
        res.json({
          success: false,
          message: `Error reading svideo.json: ${err.message}`,
        })
      }
    } else {
      res.json({
        success: false,
        message: 'svideo.json not found',
      })
    }
  } else {
    res.json({
      success: false,
      message: 'Folder not found',
    })
  }
})

router.post("/update-svideo/:id", async (req, res) => {
  const svideoId = req.params.id
  const svideoPath = path.join(dirPath, svideoId)
  const jsonFilePath = path.join(svideoPath, 'video.json')
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
  let svideo = JSON.parse(jsonData)
  svideo.title = req.body.title
  fs.writeFileSync(jsonFilePath, JSON.stringify(svideo, null, 2))

  res.json({
    success: true
  })
})

router.post("/update-svideo-with-image/:id", async (req, res) => {
  const svideoId = req.params.id
  let svideoPath = path.join(dirPath, svideoId)
  const jsonFilePath = path.join(svideoPath, 'video.json')
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
  let svideo = JSON.parse(jsonData)

  const imageUpload = createMulterInstance(svideoPath)
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

  const oldImagePath = path.join(svideoPath, svideo.image);
  fs.unlink(oldImagePath, (err) => {
    if (err) {
      console.error(`Failed to delete old image: ${err}`);
    } 
  });

  svideo.title = req.body.title
  svideo.image = imageName

  fs.writeFileSync(jsonFilePath, JSON.stringify(svideo, null, 2))

  res.json({
    success: true
  })
})

router.post("/update-svideo-with-video/:id", async (req, res) => {
  const svideoId = req.params.id
  let svideoPath = path.join(dirPath, svideoId)
  const jsonFilePath = path.join(svideoPath, 'video.json')
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
  let svideo = JSON.parse(jsonData)

  const videoUpload = createMulterInstance(svideoPath)
  await new Promise((resolve, reject) => {
    videoUpload.fields([{ name: "video", maxCount: 1 }])(req, res, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
  let videoName = req.files["video"][0].filename

  const oldVideoPath = path.join(svideoPath, svideo.video);
  fs.unlink(oldVideoPath, (err) => {
    if (err) {
      console.error(`Failed to delete old video: ${err}`);
    }
  });

  svideo.title = req.body.title
  svideo.video = videoName

  fs.writeFileSync(jsonFilePath, JSON.stringify(svideo, null, 2))

  res.json({
    success: true
  })
})

router.post("/update-svideo-with-image-video/:id", async (req, res) => {
  const svideoId = req.params.id
  let svideoPath = path.join(dirPath, svideoId)
  const jsonFilePath = path.join(svideoPath, 'video.json')
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
  let svideo = JSON.parse(jsonData)

  const fileUpload = createMulterInstance(svideoPath)
  await new Promise((resolve, reject) => {
    fileUpload.fields([
      { name: "image", maxCount: 1 }, 
      { name: "video", maxCount: 1 }
    ])(req, res, (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve();
    });
  });
  let videoName = req.files["video"][0].filename
  let imageName = req.files["image"][0].filename

  const oldVideoPath = path.join(svideoPath, svideo.video);
  fs.unlink(oldVideoPath, (err) => {
    if (err) {
      console.error(`Failed to delete old video: ${err}`);
    } 
  });

  const oldImagePath = path.join(svideoPath, svideo.image);
  fs.unlink(oldImagePath, (err) => {
    if (err) {
      console.error(`Failed to delete old video: ${err}`);
    } 
  });

  svideo.title = req.body.title
  svideo.video = videoName
  svideo.image = imageName

  fs.writeFileSync(jsonFilePath, JSON.stringify(svideo, null, 2))

  res.json({
    success: true
  })
})

router.delete("/delete-svideo/:id", (req, res) => {
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
