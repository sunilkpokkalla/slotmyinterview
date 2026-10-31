import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config/env.js";
import { logger } from "../config/logger.js";
import { supabase } from "../config/supabase.js";

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
    // 1. Supabase Storage: If Supabase client is connected
    if (supabase) {
      try {
        const bucket = config.supabase.storageBucket || "slotmyinterview-media";
        const fileBuffer = fs.readFileSync(file.path);
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(file.filename, fileBuffer, {
            contentType: file.mimetype,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage
            .from(bucket)
            .getPublicUrl(file.filename);

          logger.info(`Uploaded file ${file.filename} to Supabase Storage: ${publicData.publicUrl}`);
          return publicData.publicUrl;
        } else {
          logger.warn(`Supabase storage upload: ${error?.message}. Using local storage fallback.`);
        }
      } catch (err: any) {
        logger.warn(`Supabase storage exception: ${err.message}. Using local storage fallback.`);
      }
    }

    // 2. AWS S3 fallback
    if (config.storage.provider === "s3" && config.storage.s3.accessKeyId) {
      logger.info(`Simulated S3 upload for file ${file.filename} to bucket ${config.storage.s3.bucket}`);
      return `https://${config.storage.s3.bucket}.s3.${config.storage.s3.region}.amazonaws.com/${file.filename}`;
    }

    // 3. Default: Local storage URL served by Express static middleware
    return `${config.apiBaseUrl}/uploads/${file.filename}`;
  },

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (supabase && fileUrl.includes("/storage/v1/object/public/")) {
        const parts = fileUrl.split("/storage/v1/object/public/")[1]?.split("/");
        if (parts && parts.length >= 2) {
          const bucket = parts[0];
          const filename = parts.slice(1).join("/");
          await supabase.storage.from(bucket).remove([filename]);
          return;
        }
      }

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
