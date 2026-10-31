import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5001", 10),
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5001",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  db: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/slotmyinterview?schema=public",
    directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },

  supabase: {
    url: process.env.SUPABASE_URL || "https://lrxdcfcqkspzgtqngrae.supabase.co",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    jwtSecret: process.env.SUPABASE_JWT_SECRET || "",
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET || "slotmyinterview-media",
  },

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "default_access_secret_change_in_production",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "default_refresh_secret_change_in_production",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  email: {
    provider: (process.env.EMAIL_PROVIDER || "resend") as "resend" | "sendgrid" | "console",
    resendApiKey: process.env.RESEND_API_KEY || "",
    sendgridApiKey: process.env.SENDGRID_API_KEY || "",
    from: process.env.FROM_EMAIL || "notifications@slotmyinterview.com",
  },

  storage: {
    provider: (process.env.STORAGE_PROVIDER || "local") as "local" | "s3" | "cloudinary",
    uploadDir: path.resolve(__dirname, "../../uploads"),
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      region: process.env.AWS_REGION || "us-east-1",
      bucket: process.env.AWS_S3_BUCKET || "slotmyinterview-media",
    },
  },

  oauth: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    },
  },

  scoring: {
    githubToken: process.env.GITHUB_API_TOKEN || "",
    weights: {
      github: 0.35,
      assessments: 0.25,
      completeness: 0.25,
      endorsements: 0.15,
    },
  },
};

