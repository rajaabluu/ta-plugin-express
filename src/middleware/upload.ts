import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "/src/uploads/",
  filename: (req, file, callback) => {
    callback(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      return callback(null, true);
    } else {
      callback(new Error("invalid image format!"));
    }
  },
});
