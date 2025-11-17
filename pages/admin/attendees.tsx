import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";

type Attendee = {
	id: number;
	created_at: string;
	name: string;
	whatsapp: string;
	email: string;
	city: string;
	referrer: string | null;
	occupation: string | null;
	organization: string | null;
	status: "pending" | "approved" | "rejected";
};

export default function AdminAttendees() {
	const [attendees, setAttendees] = useState<Attendee[]>([]);
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState(false);
	const [emailSettings, setEmailSettings] = useState<{ subject: string; body: string; sender?: string; auto_send?: boolean } | null>(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const { data } = await supabase
				.from("attendees")
				.select("*")
				.order("created_at", { ascending: false });
			if (!mounted) return;
			setAttendees((data as Attendee[]) || []);
			setLoading(false);
		};
		const loadEmailSettings = async () => {
			const { data } = await supabase.from("email_settings").select("*").eq("key", "attendee_ticket").single();
			if (!mounted) return;
			if (data) {
				setEmailSettings({
					subject: data.subject || "Your Founders Fest E-ticket",
					body: data.body || "Thank you for registering. Here is your E-ticket.",
					sender: data.sender || undefined,
					auto_send: data.auto_send ?? true,
				});
			} else {
				setEmailSettings({
					subject: "Your Founders Fest E-ticket",
					body: "Thank you for registering. Here is your E-ticket.",
					sender: undefined,
					auto_send: true,
				});
			}
		};
		loadEmailSettings();
		load();
		return () => { mounted = false; };
	}, []);

	const sendTicketEmail = async (a: Attendee) => {
		// Basic QR image URL, encode attendee id + email
		const qrData = encodeURIComponent(`attendee:${a.id}:${a.email}`);
		const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}`;
		const subject = emailSettings?.subject || "Your Founders Fest E-ticket";
		const bodyText = emailSettings?.body || "Thank you for registering. Here is your E-ticket.";
		const from = emailSettings?.sender;
		const html = `
			<div style="font-family:Arial,Helvetica,sans-serif;background:#0b0b0b;color:#fff;padding:24px">
				<div style="max-width:640px;margin:0 auto;background:#111;border:1px solid #333;border-radius:12px;overflow:hidden">
					<div style="padding:20px 24px;background:#ffd400;color:#111;font-weight:700;font-size:18px">Founders Fest E-ticket</div>
					<div style="padding:24px">
						<p style="margin:0 0 12px 0;color:#ddd">${bodyText}</p>
						<div style="margin:18px 0;padding:16px;border:1px solid #222;border-radius:10px;background:#0f0f0f">
							<div style="font-size:16px;margin-bottom:10px"><strong>Name:</strong> ${a.name}</div>
							<div style="font-size:16px;margin-bottom:10px"><strong>Email:</strong> ${a.email}</div>
							<div style="font-size:16px;margin-bottom:10px"><strong>City:</strong> ${a.city}</div>
							<div style="margin-top:16px;text-align:center">
								<img alt="E-ticket QR" src="${qrUrl}" width="220" height="220" style="display:inline-block;border-radius:8px;border:1px solid #222" />
							</div>
							<div style="font-size:12px;color:#aaa;margin-top:10px;text-align:center">Present this QR at entry</div>
						</div>
						<p style="margin:12px 0 0 0;color:#aaa;font-size:12px">If you didn’t request this, please ignore.</p>
					</div>
				</div>
			</div>
		`;
		await fetch("/api/email/send-ticket", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ to: a.email, subject, html, from }),
		});
	};

	const updateStatus = async (id: number, status: "approved" | "rejected" | "pending") => {
		await supabase.from("attendees").update({ status }).eq("id", id);
		setAttendees((prev) => prev.map((a) => (a.id === id ? { ...a, status } as Attendee : a)));
		// Auto-send email on approve
		if (status === "approved" && emailSettings?.auto_send) {
			const attendee = attendees.find((x) => x.id === id);
			if (attendee?.email) {
				try { await sendTicketEmail(attendee); } catch {}
			}
		}
	};

	const csvData = useMemo(() => {
		const header = ["id","created_at","name","whatsapp","email","city","referrer","occupation","organization","status"];
		const rows = attendees.map((a) => [
			a.id, a.created_at, a.name, a.whatsapp, a.email, a.city,
			a.referrer || "", a.occupation || "", a.organization || "", a.status
		]);
		return [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
	}, [attendees]);

	const handleExport = async () => {
		setExporting(true);
		const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "attendees.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		setExporting(false);
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head>
				<title>Dashboard – Attendees</title>
			</Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<AdminGuard>
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-primary-yellow">Attendees</h1>
					<div className="flex items-center gap-3">
						<Link href="/admin" className="text-sm text-primary-yellow underline">Back to Admin</Link>
						<button
						onClick={handleExport}
						disabled={exporting}
						className="bg-primary-yellow text-primary-black px-4 py-2 rounded-full font-semibold"
					>
						{exporting ? "Exporting..." : "Export CSV"}
						</button>
					</div>
				</div>
				<div className="bg-white/5 rounded-xl overflow-auto">
					<table className="min-w-full text-sm">
						<thead className="bg-white/10">
							<tr>
								<th className="text-left px-4 py-3">Name</th>
								<th className="text-left px-4 py-3">WhatsApp</th>
								<th className="text-left px-4 py-3">Email</th>
								<th className="text-left px-4 py-3">City</th>
								<th className="text-left px-4 py-3">Status</th>
								<th className="text-left px-4 py-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td className="px-4 py-4" colSpan={6}>Loading...</td></tr>
							) : attendees.length === 0 ? (
								<tr><td className="px-4 py-4" colSpan={6}>No attendees yet.</td></tr>
							) : attendees.map((a) => (
								<tr key={a.id} className="border-t border-white/10">
									<td className="px-4 py-3">{a.name}</td>
									<td className="px-4 py-3">{a.whatsapp}</td>
									<td className="px-4 py-3">{a.email}</td>
									<td className="px-4 py-3">{a.city}</td>
									<td className="px-4 py-3 capitalize">{a.status}</td>
									<td className="px-4 py-3 space-x-2">
										<button
											onClick={() => updateStatus(a.id, "approved")}
											className="bg-green-500/80 hover:bg-green-500 text-black px-3 py-1 rounded"
										>
											Approve
										</button>
										<button
											onClick={() => updateStatus(a.id, "rejected")}
											className="bg-red-500/80 hover:bg-red-500 text-black px-3 py-1 rounded-full"
										>
											Reject
										</button>
										<button
											onClick={() => updateStatus(a.id, "pending")}
											className="bg-yellow-400/80 hover:bg-yellow-400 text-black px-3 py-1 rounded"
										>
											Reset
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				</AdminGuard>
			</main>
		</div>
	);
}


