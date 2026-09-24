type SendResult = { ok: boolean; demo: boolean };

export async function sendOtpViaWhatsApp(phone: string, code: string): Promise<SendResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) {
    console.log(`[WHATSAPP-DEMO] OTP for ${phone}: ${code}`);
    return { ok: true, demo: true };
  }

  const template = process.env.WHATSAPP_TEMPLATE || "otp_verification";
  const lang = process.env.WHATSAPP_LANG || "en";

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone.replace(/[^\d+]/g, ""),
        type: "template",
        template: {
          name: template,
          language: { code: lang },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: code }],
            },
          ],
        },
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("WHATSAPP_SEND_FAIL", res.status, body);
      return { ok: false, demo: false };
    }
    return { ok: true, demo: false };
  } catch (e) {
    console.error("WHATSAPP_SEND_ERROR", e);
    return { ok: false, demo: false };
  }
}