import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Настройка CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Отправка письма
    const { data, error } = await resend.emails.send({
      from: "SkillOrbit Waitlist <onboarding@resend.dev>",
      to: ["iakovakula2@gmail.com"], // Ваш аккаунт в Resend
      subject: "Новая заявка в SkillOrbit Waitlist! 🚀",
      html: `<p>Новый подписчик: <strong>${cleanEmail}</strong></p>`
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}