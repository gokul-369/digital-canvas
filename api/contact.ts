import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

interface MailBody {
  name: string;
  email: string;
  message: string;
  idea: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, message, idea } = req.body as MailBody;

  if (!name || !email || !message || !idea) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY environment variable");
    return res.status(500).json({ error: "Server configuration error: missing RESEND_API_KEY" });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Gokul — Portfolio <onboarding@resend.dev>",
      to: ["gokul369@outlook.com"],
      subject: `Need some insights on ${idea}`,
      replyTo: email,
      html: `
        <div style="font-family: system-ui; line-height:1.6">
          <h2>New Contact Message</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Topic / Idea:</b> ${idea}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ emailSent: true });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Resend API error:", error);
    return res.status(500).json({ error: error?.message || "Email dispatch failed" });
  }
}
