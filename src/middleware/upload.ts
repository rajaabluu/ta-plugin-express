import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: (_, file, callback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return callback(null, true);
    }
    callback(new Error("Only image files are allowed."));
  },
});
