const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const MIME_TYPES_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profile-images");
  },
  filename: (req, file, cb) => {
    const userId = req.user && req.user.id;
    const random = crypto.randomBytes(10).toString("hex");
    const ext = MIME_TYPES_MAP[file.mimetype];
    cb(null, `${random}-${userId}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isValidType = Boolean(MIME_TYPES_MAP[file.mimetype]);
  if (!isValidType) {
    cb(new multer.MulterError("invalid image type"), false);
    return;
  }
  cb(null, true);
};

const SIZE_LIMIT_MB = 1
const SIZE_LIMIT = SIZE_LIMIT_MB * 1024 * 1024;
const limits = {
    fileSize: SIZE_LIMIT,
    files: 1
}
module.exports = { storage, fileFilter, limits, SIZE_LIMIT_MB };
