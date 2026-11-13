import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const adminEmail = process.env.ADMIN_EMAIL || "iakovan2329@gmail.com";


    if (audienceId) {
      const { data: existingContact } = await resend.contacts.get({
        email: cleanEmail,
        audienceId,
      });

      if (existingContact) {
        return res.status(409).json({
          error: "Already registered",
          code: "ALREADY_EXISTS",
        });
      }

      await resend.contacts.create({
        email: cleanEmail,
        audienceId,
        unsubscribed: false,
      });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "SkillOrbit Waitlist <onboarding@resend.dev>",
      to: [adminEmail],
      subject: "🚀 Новый подписчик в SkillOrbit Waitlist!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2>Новая уникальная заявка на сайте!</h2>
          <p>Email пользователя: <strong>${cleanEmail}</strong></p>
          <p>Дата заявки: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}