const multer = require('multer');

const fileUpload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files')
    },
    filename(req, file, cb) {
      const originalNameWithoutExtension = file.originalname.split('.').slice(0, -1).join('.');
      const extension = file.originalname.split('.').pop();
      const date = new Date();
      const formattedDate = `${date.getFullYear().toString().slice(2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
      const newFilename = `${originalNameWithoutExtension}_${formattedDate}.${extension}`;
      cb(null, newFilename.replace(/\s+/g, ''))
    }
  }),
  limits: {
    fileSize: 100000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    cb(undefined, true) // continue with upload
  }
});

module.exports = fileUpload;
