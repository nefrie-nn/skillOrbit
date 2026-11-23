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
    const senderEmail = process.env.EMAIL_FROM || "SkillOrbit <waitlist@skillorbit.xyz>";
    const siteUrl = process.env.FRONTEND_URL || "https://skillorbit.xyz";

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

    const [userMail, adminMail] = await Promise.all([
      resend.emails.send({
        from: senderEmail,
        to: [cleanEmail],
        subject: "Добро пожаловать в лист ожидания SkillOrbit 🚀",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #0b0a14; color: #ffffff; border-radius: 16px; border: 1px solid #211f3d;">
            <h2 style="margin: 0 0 16px; font-size: 22px; color: #3DFF9C;">Ты в списке раннего доступа SkillOrbit!</h2>
            <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #b4b3cf;">
              Спасибо за регистрацию! Мы зафиксировали адрес <strong style="color: #ffffff;">${cleanEmail}</strong> и сообщим тебе одним из первых, когда откроем доступ к платформе P2P-обмена знаниями.
            </p>
            <div style="margin: 28px 0;">
              <a href="${siteUrl}" style="display: inline-block; padding: 12px 22px; background-color: #3DFF9C; color: #0b0a14; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 10px;">
                Вернуться на SkillOrbit
              </a>
            </div>
            <p style="margin: 24px 0 0; padding-top: 16px; border-top: 1px solid #211f3d; font-size: 12px; color: #8e8ea8;">
              Если вы не оставляли заявку на ${siteUrl}, просто проигнорируйте это письмо.
            </p>
          </div>
        `,
      }),
      resend.emails.send({
        from: senderEmail,
        to: [adminEmail],
        subject: "🚀 Новый подписчик в SkillOrbit Waitlist!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <h2>Новая уникальная заявка на сайте!</h2>
            <p>Email пользователя: <strong>${cleanEmail}</strong></p>
            <p>Дата заявки: ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" })}</p>
          </div>
        `,
      }),
    ]);

    if (userMail.error) {
      return res.status(400).json({ error: userMail.error.message });
    }

    return res.status(200).json({
      success: true,
      data: { userEmailId: userMail.data?.id, adminEmailId: adminMail.data?.id },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}