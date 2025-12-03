const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const asyncHandler = require('../utils/asyncHandler');
const { saveUpload } = require('./upload.service');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

router.post(
  '/',
  upload.single('file'),
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next({ status: 400, message: 'File is required' });
    }

    const url = `/uploads/${req.file.filename}`;
    await saveUpload({ ...req.file, url });

    res.status(201).json({
      url,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  })
);

module.exports = router;






