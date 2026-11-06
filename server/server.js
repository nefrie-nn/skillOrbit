import express from "express"
import cors from "cors"
import "dotenv/config"
import { Resend } from "resend"
import rateLimit from "express-rate-limit"
import validator from "validator"

const app = express()

// Trust reverse proxy headers for production hosts (Render, Heroku, Vercel, etc.)
app.set("trust proxy", 1);

// 1. CORS Configuration: restrict requests to allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman) or origins matching the allowlist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Access blocked by CORS policy"));
    }
  }
}));

app.use(express.json());

// 2. Anti-spam and DDoS protection (max 5 attempts per IP per 15 minutes)
const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests from your IP. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/send-receipt", waitlistLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // 3. Strict backend validation and sanitization
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Please provide an email address" });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ error: "Invalid email address format" });
    }

    // 4. Send email via Resend API
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: cleanEmail,
      subject: "You're on the waitlist!",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Welcome to the waitlist!</h1>
          <p>Thanks for joining. We'll let you know as soon as we launch.</p>
        </div>
      `
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return res.status(500).json({ error: "Failed to send confirmation email. Please try again later." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[Server Error]:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Global error handling middleware (including CORS policy blocks)
app.use((err, req, res, next) => {
  if (err.message === "Access blocked by CORS policy") {
    return res.status(403).json({ error: "Request blocked by CORS policy" });
  }
  return res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});