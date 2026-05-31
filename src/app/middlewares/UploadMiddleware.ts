import multer, { FileFilterCallback } from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/challenges"),
  filename: (_req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
