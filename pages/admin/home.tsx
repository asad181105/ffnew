import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

type HomeSettings = {
	id: number;
	video_url: string | null;
	autoplay: boolean | null;
	fallback_image_url: string | null;
};

export default function AdminHomeSettings() {
	const [settings, setSettings] = useState<HomeSettings | null>(null);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const { data } = await supabase
				.from("home_settings")
				.select("*")
				.eq("id", 1)
				.single();
			if (!mounted) return;
			if (data) setSettings(data as HomeSettings);
			else setSettings({ id: 1, video_url: "", autoplay: false, fallback_image_url: "" });
		};
		load();
		return () => { mounted = false; };
	}, []);

	const handleSave = async () => {
		if (!settings) return;
		setSaving(true);
		setMessage(null);
		const payload = {
			video_url: settings.video_url,
			autoplay: settings.autoplay,
			fallback_image_url: settings.fallback_image_url,
		};
		const { error } = await supabase
			.from("home_settings")
			.upsert({ id: 1, ...payload }, { onConflict: "id" });
		if (error) setMessage(error.message);
		else setMessage("Saved.");
		setSaving(false);
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head>
				<title>Dashboard – Home Page Settings</title>
			</Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<AdminGuard>
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-primary-yellow">Home Page Settings</h1>
					<Link href="/admin" className="text-sm text-primary-yellow underline">Back to Admin</Link>
				</div>
				<div className="bg-white/5 rounded-xl p-6 space-y-4">
					<div>
						<label className="block text-sm mb-1">Hero Video URL</label>
						<input
							value={settings?.video_url || ""}
							onChange={(e) => setSettings((s) => s ? { ...s, video_url: e.target.value } : s)}
							placeholder="/bgvideo.mp4 or https URL"
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							checked={Boolean(settings?.autoplay)}
							onChange={(e) => setSettings((s) => s ? { ...s, autoplay: e.target.checked } : s)}
						/>
						<label>Autoplay</label>
					</div>
					<div>
						<label className="block text-sm mb-1">Fallback Image URL</label>
						<input
							value={settings?.fallback_image_url || ""}
							onChange={(e) => setSettings((s) => s ? { ...s, fallback_image_url: e.target.value } : s)}
							placeholder="Image URL when video not playing"
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<button
						onClick={handleSave}
						disabled={saving}
						className="bg-primary-yellow text-primary-black px-4 py-2 rounded-full font-semibold"
					>
						{saving ? "Saving..." : "Save"}
					</button>
					{message && <p className="text-sm mt-2">{message}</p>}
				</div>
				</AdminGuard>
			</main>
		</div>
	);
}


