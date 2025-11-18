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

type ImpactStat = { id: number; value: string; label: string; order?: number | null; visible?: boolean | null };
type InteractiveSelectorOption = { id: number; title: string; description: string; image_url: string; icon_name?: string | null; order?: number | null; visible?: boolean | null };

export default function AdminHomeSettings() {
	const [settings, setSettings] = useState<HomeSettings | null>(null);
	const [whyContent, setWhyContent] = useState<Record<string, string>>({});
	const [pageSections, setPageSections] = useState<Record<string, string>>({});
	const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
	const [interactiveSelectorSettings, setInteractiveSelectorSettings] = useState<Record<string, string>>({});
	const [interactiveSelectorOptions, setInteractiveSelectorOptions] = useState<InteractiveSelectorOption[]>([]);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const [settingsRes, contentRes, sectionsRes, statsRes, selectorSettingsRes, selectorOptionsRes] = await Promise.all([
				supabase.from("home_settings").select("*").eq("id", 1).single(),
				supabase.from("home_page_content").select("*"),
				supabase.from("about_page_sections").select("*"),
				supabase.from("about_impact_stats").select("*").order("order", { ascending: true }),
				supabase.from("home_interactive_selector_settings").select("*"),
				supabase.from("home_interactive_selector_options").select("*").order("order", { ascending: true }),
			]);
			if (!mounted) return;
			if (settingsRes.data) setSettings(settingsRes.data as HomeSettings);
			else setSettings({ id: 1, video_url: "", autoplay: false, fallback_image_url: "" });
			const mapped = (contentRes.data || []).reduce((acc: any, row: any) => {
				acc[row.key] = row.value;
				return acc;
			}, {});
			setWhyContent(mapped);
			const sectionsMapped = (sectionsRes.data || []).reduce((acc: any, row: any) => {
				acc[row.key] = row.value;
				return acc;
			}, {});
			setPageSections(sectionsMapped);
			setImpactStats((statsRes.data || []) as ImpactStat[]);
			const selectorSettingsMapped = (selectorSettingsRes.data || []).reduce((acc: any, row: any) => {
				acc[row.key] = row.value;
				return acc;
			}, {});
			setInteractiveSelectorSettings(selectorSettingsMapped);
			setInteractiveSelectorOptions((selectorOptionsRes.data || []) as InteractiveSelectorOption[]);
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

				<section className="bg-white/5 rounded-xl p-6 space-y-4 mt-8">
					<h2 className="text-xl font-semibold">Section 1: For the dreamers who dare</h2>
					<div>
						<label className="block text-sm mb-1">Headline</label>
						<input
							value={whyContent.section1_headline || ""}
							onChange={async (e) => {
								setWhyContent((prev) => ({ ...prev, section1_headline: e.target.value }));
								await supabase.from("home_page_content").upsert({ key: "section1_headline", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="For the dreamers who dare and the doers who deliver"
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Sub-headline</label>
						<input
							value={whyContent.section1_subheadline || ""}
							onChange={async (e) => {
								setWhyContent((prev) => ({ ...prev, section1_subheadline: e.target.value }));
								await supabase.from("home_page_content").upsert({ key: "section1_subheadline", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="Hyderabad is building something big. Are you in?"
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Content (Paragraph 1)</label>
						<textarea
							value={whyContent.section1_content || ""}
							onChange={async (e) => {
								setWhyContent((prev) => ({ ...prev, section1_content: e.target.value }));
								await supabase.from("home_page_content").upsert({ key: "section1_content", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="Content text..."
							rows={3}
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Content (Paragraph 2)</label>
						<textarea
							value={whyContent.section1_content_2 || ""}
							onChange={async (e) => {
								setWhyContent((prev) => ({ ...prev, section1_content_2: e.target.value }));
								await supabase.from("home_page_content").upsert({ key: "section1_content_2", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="Content text..."
							rows={3}
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
				</section>

				{/* Why We Do This Section */}
				<section className="bg-white/5 rounded-xl p-6 space-y-4 mt-8">
					<h2 className="text-xl font-semibold">Why We Do This Section</h2>
					<div>
						<label className="block text-sm mb-1">Content</label>
						<textarea
							value={pageSections.why_we_do_this_content || ""}
							onChange={async (e) => {
								setPageSections((prev) => ({ ...prev, why_we_do_this_content: e.target.value }));
								await supabase.from("about_page_sections").upsert({ key: "why_we_do_this_content", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="We believe that the person standing next to you..."
							rows={3}
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
				</section>

				{/* The Proof is in the People Section */}
				<section className="bg-white/5 rounded-xl p-6 space-y-4 mt-8">
					<h2 className="text-xl font-semibold">The Proof is in the People Section</h2>
					<div>
						<label className="block text-sm mb-1">Title</label>
						<input
							value={pageSections.proof_title || ""}
							onChange={async (e) => {
								setPageSections((prev) => ({ ...prev, proof_title: e.target.value }));
								await supabase.from("about_page_sections").upsert({ key: "proof_title", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="The Proof is in the People (2023 & 2024)"
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm mb-2">Impact Stats</label>
						<div className="space-y-3">
							{impactStats.map((stat) => (
								<div key={stat.id} className="flex gap-2 items-center bg-black/30 p-3 rounded">
									<input
										value={stat.value}
										onChange={async (e) => {
											const updated = impactStats.map((s) => s.id === stat.id ? { ...s, value: e.target.value } : s);
											setImpactStats(updated);
											await supabase.from("about_impact_stats").update({ value: e.target.value }).eq("id", stat.id);
										}}
										placeholder="Value (e.g., 400+)"
										className="flex-1 rounded-md bg-black/50 border border-white/10 px-3 py-2"
									/>
									<input
										value={stat.label}
										onChange={async (e) => {
											const updated = impactStats.map((s) => s.id === stat.id ? { ...s, label: e.target.value } : s);
											setImpactStats(updated);
											await supabase.from("about_impact_stats").update({ label: e.target.value }).eq("id", stat.id);
										}}
										placeholder="Label"
										className="flex-1 rounded-md bg-black/50 border border-white/10 px-3 py-2"
									/>
									<input
										type="number"
										value={stat.order || 0}
										onChange={async (e) => {
											const updated = impactStats.map((s) => s.id === stat.id ? { ...s, order: parseInt(e.target.value) } : s);
											setImpactStats(updated);
											await supabase.from("about_impact_stats").update({ order: parseInt(e.target.value) }).eq("id", stat.id);
										}}
										placeholder="Order"
										className="w-20 rounded-md bg-black/50 border border-white/10 px-3 py-2"
									/>
									<button
										onClick={async () => {
											await supabase.from("about_impact_stats").delete().eq("id", stat.id);
											setImpactStats(impactStats.filter((s) => s.id !== stat.id));
										}}
										className="bg-red-600 text-white px-3 py-2 rounded"
									>
										Delete
									</button>
								</div>
							))}
							<button
								onClick={async () => {
									const { data } = await supabase.from("about_impact_stats").insert({ value: "", label: "", order: impactStats.length, visible: true }).select().single();
									if (data) setImpactStats([...impactStats, data as ImpactStat]);
								}}
								className="bg-primary-yellow text-primary-black px-4 py-2 rounded"
							>
								Add Stat
							</button>
						</div>
					</div>
				</section>

				{/* Join Us for the Next Chapter Section */}
				<section className="bg-white/5 rounded-xl p-6 space-y-4 mt-8">
					<h2 className="text-xl font-semibold">Join Us for the Next Chapter Section</h2>
					<div>
						<label className="block text-sm mb-1">Title</label>
						<input
							value={pageSections.join_next_chapter_title || ""}
							onChange={async (e) => {
								setPageSections((prev) => ({ ...prev, join_next_chapter_title: e.target.value }));
								await supabase.from("about_page_sections").upsert({ key: "join_next_chapter_title", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="Join Us for the Next Chapter"
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Date</label>
						<input
							value={pageSections.join_next_chapter_date || ""}
							onChange={async (e) => {
								setPageSections((prev) => ({ ...prev, join_next_chapter_date: e.target.value }));
								await supabase.from("about_page_sections").upsert({ key: "join_next_chapter_date", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="Dec 31st, 2025 & Jan 1st, 2026"
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Venue</label>
						<input
							value={pageSections.join_next_chapter_venue || ""}
							onChange={async (e) => {
								setPageSections((prev) => ({ ...prev, join_next_chapter_venue: e.target.value }));
								await supabase.from("about_page_sections").upsert({ key: "join_next_chapter_venue", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="Public Gardens, Nampally, Hyderabad."
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Content</label>
						<textarea
							value={pageSections.join_next_chapter_content || ""}
							onChange={async (e) => {
								setPageSections((prev) => ({ ...prev, join_next_chapter_content: e.target.value }));
								await supabase.from("about_page_sections").upsert({ key: "join_next_chapter_content", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="Don't just watch Hyderabad grow..."
							rows={2}
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
				</section>

				{/* Interactive Selector Section */}
				<section className="bg-white/5 rounded-xl p-6 space-y-4 mt-8">
					<h2 className="text-xl font-semibold">Interactive Selector Section</h2>
					<div>
						<label className="block text-sm mb-1">Title</label>
						<input
							value={interactiveSelectorSettings.title || ""}
							onChange={async (e) => {
								setInteractiveSelectorSettings((prev) => ({ ...prev, title: e.target.value }));
								await supabase.from("home_interactive_selector_settings").upsert({ key: "title", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="Experience Founders Fest"
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm mb-1">Subtitle</label>
						<textarea
							value={interactiveSelectorSettings.subtitle || ""}
							onChange={async (e) => {
								setInteractiveSelectorSettings((prev) => ({ ...prev, subtitle: e.target.value }));
								await supabase.from("home_interactive_selector_settings").upsert({ key: "subtitle", value: e.target.value }, { onConflict: "key" });
							}}
							placeholder="Discover what makes Founders Fest..."
							rows={2}
							className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm mb-2">Options</label>
						<div className="space-y-3">
							{interactiveSelectorOptions.map((opt) => (
								<div key={opt.id} className="bg-black/30 p-4 rounded space-y-2">
									<div className="flex gap-2">
										<input
											value={opt.title}
											onChange={async (e) => {
												const updated = interactiveSelectorOptions.map((o) => o.id === opt.id ? { ...o, title: e.target.value } : o);
												setInteractiveSelectorOptions(updated);
												await supabase.from("home_interactive_selector_options").update({ title: e.target.value }).eq("id", opt.id);
											}}
											placeholder="Title"
											className="flex-1 rounded-md bg-black/50 border border-white/10 px-3 py-2"
										/>
										<input
											type="number"
											value={opt.order || 0}
											onChange={async (e) => {
												const updated = interactiveSelectorOptions.map((o) => o.id === opt.id ? { ...o, order: parseInt(e.target.value) } : o);
												setInteractiveSelectorOptions(updated);
												await supabase.from("home_interactive_selector_options").update({ order: parseInt(e.target.value) }).eq("id", opt.id);
											}}
											placeholder="Order"
											className="w-20 rounded-md bg-black/50 border border-white/10 px-3 py-2"
										/>
									</div>
									<textarea
										value={opt.description}
										onChange={async (e) => {
											const updated = interactiveSelectorOptions.map((o) => o.id === opt.id ? { ...o, description: e.target.value } : o);
											setInteractiveSelectorOptions(updated);
											await supabase.from("home_interactive_selector_options").update({ description: e.target.value }).eq("id", opt.id);
										}}
										placeholder="Description"
										rows={2}
										className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
									/>
									<input
										value={opt.image_url}
										onChange={async (e) => {
											const updated = interactiveSelectorOptions.map((o) => o.id === opt.id ? { ...o, image_url: e.target.value } : o);
											setInteractiveSelectorOptions(updated);
											await supabase.from("home_interactive_selector_options").update({ image_url: e.target.value }).eq("id", opt.id);
										}}
										placeholder="Image URL"
										className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2"
									/>
									<div className="flex gap-2">
										<select
											value={opt.icon_name || ""}
											onChange={async (e) => {
												const updated = interactiveSelectorOptions.map((o) => o.id === opt.id ? { ...o, icon_name: e.target.value } : o);
												setInteractiveSelectorOptions(updated);
												await supabase.from("home_interactive_selector_options").update({ icon_name: e.target.value }).eq("id", opt.id);
											}}
											className="flex-1 rounded-md bg-black/50 border border-white/10 px-3 py-2"
										>
											<option value="">Select Icon</option>
											<option value="ShoppingBag">Shopping Bag</option>
											<option value="Mic">Mic</option>
											<option value="Users">Users</option>
											<option value="Award">Award</option>
											<option value="Network">Network</option>
										</select>
										<button
											onClick={async () => {
												await supabase.from("home_interactive_selector_options").delete().eq("id", opt.id);
												setInteractiveSelectorOptions(interactiveSelectorOptions.filter((o) => o.id !== opt.id));
											}}
											className="bg-red-600 text-white px-3 py-2 rounded"
										>
											Delete
										</button>
									</div>
								</div>
							))}
							<button
								onClick={async () => {
									const { data } = await supabase.from("home_interactive_selector_options").insert({ title: "", description: "", image_url: "", icon_name: "ShoppingBag", order: interactiveSelectorOptions.length, visible: true }).select().single();
									if (data) setInteractiveSelectorOptions([...interactiveSelectorOptions, data as InteractiveSelectorOption]);
								}}
								className="bg-primary-yellow text-primary-black px-4 py-2 rounded"
							>
								Add Option
							</button>
						</div>
					</div>
				</section>
				</AdminGuard>
			</main>
		</div>
	);
}


