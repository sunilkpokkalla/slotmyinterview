import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config/env.js";
import { logger } from "../config/logger.js";

// Ensure local uploads directory exists
if (!fs.existsSync(config.storage.uploadDir)) {
  fs.mkdirSync(config.storage.uploadDir, { recursive: true });
}

// Multer storage config for local storage
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.storage.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

export const uploadMiddleware = multer({
  storage: diskStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP and GIF image formats are allowed"));
    }
  },
});

export const storageService = {
  async saveFile(file: Express.Multer.File): Promise<string> {
    if (config.storage.provider === "s3" && config.storage.s3.accessKeyId) {
      // In production S3 environment, upload to AWS S3 using AWS SDK / S3Client
      logger.info(`Simulated S3 upload for file ${file.filename} to bucket ${config.storage.s3.bucket}`);
      return `https://${config.storage.s3.bucket}.s3.${config.storage.s3.region}.amazonaws.com/${file.filename}`;
    }

    // Default: Local storage URL served by Express static middleware
    return `${config.apiBaseUrl}/uploads/${file.filename}`;
  },

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (fileUrl.includes("/uploads/")) {
        const filename = fileUrl.split("/uploads/").pop();
        if (filename) {
          const filePath = path.join(config.storage.uploadDir, filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    } catch (err: any) {
      logger.warn(`Failed to delete file ${fileUrl}: ${err.message}`);
    }
  },
};

