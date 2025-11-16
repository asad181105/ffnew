import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type Body = {
	to: string;
	subject: string;
	html: string;
	from?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}
	const { to, subject, html, from }: Body = req.body || {};
	if (!to || !subject || !html) {
		return res.status(400).json({ error: "Missing fields" });
	}
	try {
		const host = process.env.SMTP_HOST;
		const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
		const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true";
		const user = process.env.SMTP_USER;
		const pass = process.env.SMTP_PASS;
		const fromAddress = from || process.env.SMTP_FROM || "no-reply@foundersfest.com";

		const missing: string[] = [];
		if (!host) missing.push("SMTP_HOST");
		if (!process.env.SMTP_PORT) missing.push("SMTP_PORT");
		if (!process.env.SMTP_SECURE) missing.push("SMTP_SECURE");
		if (!user) missing.push("SMTP_USER");
		if (!pass) missing.push("SMTP_PASS");
		if (missing.length) {
			return res.status(400).json({ error: "Missing SMTP env vars", missing });
		}

		const transporter = nodemailer.createTransport({
			host,
			port,
			secure,
			auth: { user, pass },
		});

		const info = await transporter.sendMail({
			from: fromAddress,
			to,
			subject,
			html,
		});
		return res.status(200).json({ ok: true, messageId: info.messageId });
	} catch (e: any) {
		// Log server-side error details for debugging (will appear in server logs)
		console.error("[send-ticket] SMTP error:", e);
		return res.status(500).json({
			error: e?.message || "Failed to send email",
		});
	}
}


