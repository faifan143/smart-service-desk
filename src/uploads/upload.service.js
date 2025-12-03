const Upload = require('./upload.model');

const saveUpload = ({ filename, originalname, mimetype, size, url }) =>
  Upload.create({
    filename,
    originalName: originalname,
    mimetype,
    size,
    url,
  });

module.exports = { saveUpload };






