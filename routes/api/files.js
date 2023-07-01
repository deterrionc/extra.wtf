const express = require('express');
const router = express.Router();

// FILE DELETE
var fs = require('fs');
var path = require('path');

router.post('/create-file', async (req, res) => {
  res.json({
    success: true
  });
});

router.get('/get-files', async (req, res) => {
  try {
    const dirPath = './files/temp'; // specify the directory path
    const allFiles = getAllFiles(dirPath); // get all files

    const mediaFiles = allFiles.filter(file => {
      // return file.type === 'image' || file.type === 'video'; // check if the file is an image or a video
      return file.type === 'video'; // check if the file is an image or a video
    });

    res.json({
      success: true,
      files: mediaFiles
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'An error occurred while fetching the files.'
    });
  }
});

router.get('/get-file/:id', async (req, res) => {
  res.json({
    success: true
  });
});

router.post('/update-file/:id', async (req, res) => {
  res.json({
    success: true
  });
});

router.delete('/delete-file/:id', async (req, res) => {
  res.json({
    success: true
  });
});

// Define video and image extensions
const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.flv'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.svg'];

// Utility function to get all files in directory
const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)
  
  arrayOfFiles = arrayOfFiles || []
  
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      let ext = path.extname(file);
      let type = 'other';

      if (videoExtensions.includes(ext)) {
        type = 'video';
      } else if (imageExtensions.includes(ext)) {
        type = 'image';
      }
      
      arrayOfFiles.push({
        type: type,
        name: path.basename(file),
        path: path.join(dirPath, "/", file)
      });
    }
  })
  
  return arrayOfFiles
}

module.exports = router;
