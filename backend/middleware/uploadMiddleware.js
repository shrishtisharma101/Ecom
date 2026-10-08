const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
      callback(new Error("Profile image must be a JPEG, PNG, WEBP, or GIF file."));
      return;
    }

    callback(null, true);
  },
}).single("profileImage");

const profileImageUpload = (req, res, next) => {
  upload(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const statusCode = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
      ? 413
      : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  });
};

module.exports = profileImageUpload;
