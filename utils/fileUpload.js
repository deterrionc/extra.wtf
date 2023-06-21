const multer = require('multer')

const fileUpload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files')
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname.replace(/\s+/g, '')}`)
    }
  }),
  limits: {
    fileSize: 100000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    cb(undefined, true) // continue with upload
  }
})

module.exports = fileUpload