import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminEmailSettings() {
	const [subject, setSubject] = useState("Your Founders Fest E-ticket");
	const [body, setBody] = useState("Thank you for registering. Here is your E-ticket.");
	const [sender, setSender] = useState("");
	const [autoSend, setAutoSend] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const { data } = await supabase.from("email_settings").select("*").eq("key", "attendee_ticket").single();
			if (!mounted) return;
			if (data) {
				setSubject(data.subject || subject);
				setBody(data.body || body);
				setSender(data.sender || "");
				setAutoSend(data.auto_send ?? true);
			}
		};
		load();
		return () => { mounted = false; };
	}, []);

	const save = async () => {
		setSaving(true);
		await supabase.from("email_settings").upsert({
			key: "attendee_ticket",
			subject,
			body,
			sender,
			auto_send: autoSend,
		}, { onConflict: "key" });
		setSaving(false);
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head><title>Dashboard – Email & Ticket Customization</title></Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
				<AdminGuard>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-primary-yellow">Email & Ticket Customization</h1>
					<Link href="/admin" className="text-sm text-primary-yellow underline">Back to Admin</Link>
				</div>
				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<div>
						<label className="block text-sm mb-1">Sender Email ID</label>
						<input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="no-reply@foundersfest.com" className="w-full rounded-md bg-black/40 border border-white/10 p-2" />
					</div>
					<div>
						<label className="block text-sm mb-1">Email subject</label>
						<input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-md bg-black/40 border border-white/10 p-2" />
					</div>
					<div>
						<label className="block text-sm mb-1">Email body</label>
						<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
					</div>
					<label className="inline-flex items-center gap-2">
						<input type="checkbox" checked={autoSend} onChange={(e) => setAutoSend(e.target.checked)} />
						<span>Auto-send ticket on approve</span>
					</label>
					<div>
						<button onClick={save} disabled={saving} className="bg-primary-yellow text-black px-4 py-2 rounded-full font-semibold">{saving ? "Saving..." : "Save Settings"}</button>
					</div>
				</section>
				</AdminGuard>
			</main>
		</div>
	);
}


