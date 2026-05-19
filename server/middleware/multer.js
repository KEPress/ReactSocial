const multer = require('multer')

const storage = multer.diskStorage({ })

exports.upload = multer({ storage })