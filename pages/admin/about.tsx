import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Metric = { id?: string; title: string; value: string; visible?: boolean; order?: number };
type ImageItem = { id?: string; url: string; alt?: string; visible?: boolean; order?: number };
type Section = {
	year: number;
	metrics: Metric[];
	images: ImageItem[];
	rotation_enabled: boolean;
	rotation_speed: number;
	hover_zoom_enabled: boolean;
	section_enabled?: boolean;
};

type Member = { id?: number; name: string; designation: string; responsibility?: string | null; image?: string | null; social_url?: string | null; visible?: boolean | null; order?: number | null };

type AboutPageSection = { key: string; value: string }
type AboutPageImage = { id?: number; section_key: string; url: string; alt?: string | null; order?: number | null; visible?: boolean | null }
type EdVentureMetric = { id?: number; icon?: string | null; value: string; label: string; order?: number | null; visible?: boolean | null }
type Testimonial = { id?: number; quote: string; author_name: string; author_title: string; author_image_url?: string | null; gradient_color?: string | null; order?: number | null; visible?: boolean | null }
type ImpactStat = { id?: number; value: string; label: string; order?: number | null; visible?: boolean | null }

export default function AdminAbout() {
	const [tab, setTab] = useState<"2023" | "2024" | "team" | "new">("2023");
	const [section, setSection] = useState<Section | null>(null);
	const [members, setMembers] = useState<Member[]>([]);
	const [pageSections, setPageSections] = useState<Record<string, string>>({});
	const [simpleIdeaImages, setSimpleIdeaImages] = useState<AboutPageImage[]>([]);
	const [edventureMetrics, setEdventureMetrics] = useState<EdVentureMetric[]>([]);
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
	const year = tab === "2023" ? 2023 : 2024;

	const load = async () => {
		const { data } = await supabase
			.from("about_sections")
			.select("*")
			.eq("year", year)
			.single();
		if (data) {
			setSection({
				year,
				metrics: data.metrics || [],
				images: data.images || [],
				rotation_enabled: Boolean(data.rotation_enabled),
				rotation_speed: Number(data.rotation_speed || 12),
				hover_zoom_enabled: Boolean(data.hover_zoom_enabled),
				section_enabled: data.section_enabled !== false,
			});
		} else {
			setSection({
				year,
				metrics: [],
				images: [],
				rotation_enabled: true,
				rotation_speed: 12,
				hover_zoom_enabled: true,
				section_enabled: true,
			});
		}
	};

	const loadTeam = async () => {
		const { data } = await supabase.from("team_members").select("*").order("order", { ascending: true });
		setMembers((data || []) as Member[]);
	};

	const loadNewSections = async () => {
		const [sectionsRes, imagesRes, metricsRes, testimonialsRes, statsRes] = await Promise.all([
			supabase.from('about_page_sections').select('*'),
			supabase.from('about_page_images').select('*').eq('section_key', 'simple_idea').order('order', { ascending: true }),
			supabase.from('edventure_park_metrics').select('*').order('order', { ascending: true }),
			supabase.from('about_testimonials').select('*').order('order', { ascending: true }),
			supabase.from('about_impact_stats').select('*').order('order', { ascending: true }),
		]);
		const mapped = (sectionsRes.data || []).reduce((acc: any, row: any) => {
			acc[row.key] = row.value;
			return acc;
		}, {});
		setPageSections(mapped);
		setSimpleIdeaImages((imagesRes.data || []) as AboutPageImage[]);
		setEdventureMetrics((metricsRes.data || []) as EdVentureMetric[]);
		setTestimonials((testimonialsRes.data || []) as Testimonial[]);
		setImpactStats((statsRes.data || []) as ImpactStat[]);
	};

	useEffect(() => {
		if (tab === "team") {
			loadTeam();
		} else if (tab === "new") {
			loadNewSections();
		} else {
			load();
		}
	}, [tab]);

	const save = async (partial?: Partial<Section>) => {
		if (!section) return;
		const payload = { ...section, ...partial };
		setSection(payload);
		await supabase.from("about_sections").upsert({
			year: payload.year,
			metrics: payload.metrics,
			images: payload.images,
			rotation_enabled: payload.rotation_enabled,
			rotation_speed: payload.rotation_speed,
			hover_zoom_enabled: payload.hover_zoom_enabled,
			section_enabled: payload.section_enabled,
		}, { onConflict: "year" });
	};

	const addMetric = () => {
		if (!section) return;
		const updated = { ...section, metrics: [...section.metrics, { title: "Metric", value: "0", visible: true, order: section.metrics.length }] };
		save(updated);
	};
	const updateMetric = (idx: number, m: Metric) => {
		if (!section) return;
		const arr = [...section.metrics]; arr[idx] = m;
		save({ metrics: arr });
	};
	const deleteMetric = (idx: number) => {
		if (!section) return;
		const arr = section.metrics.filter((_, i) => i !== idx);
		save({ metrics: arr });
	};
	const moveMetric = (idx: number, dir: -1 | 1) => {
		if (!section) return;
		const arr = [...section.metrics];
		const t = idx + dir; if (t < 0 || t >= arr.length) return;
		[arr[idx], arr[t]] = [arr[t], arr[idx]];
		arr.forEach((m, i) => m.order = i);
		save({ metrics: arr });
	};

	const addImage = () => {
		if (!section) return;
		const updated = { ...section, images: [...section.images, { url: "", alt: "", visible: true, order: section.images.length }] };
		save(updated);
	};
	const updateImage = (idx: number, img: ImageItem) => {
		if (!section) return;
		const arr = [...section.images]; arr[idx] = img;
		save({ images: arr });
	};
	const deleteImage = (idx: number) => {
		if (!section) return;
		const arr = section.images.filter((_, i) => i !== idx);
		save({ images: arr });
	};
	const moveImage = (idx: number, dir: -1 | 1) => {
		if (!section) return;
		const arr = [...section.images];
		const t = idx + dir; if (t < 0 || t >= arr.length) return;
		[arr[idx], arr[t]] = [arr[t], arr[idx]];
		arr.forEach((m, i) => m.order = i);
		save({ images: arr });
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head><title>Dashboard – About Page Controls</title></Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
				<AdminGuard>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-primary-yellow">About Page Controls</h1>
					<Link href="/admin" className="text-sm text-primary-yellow underline">Back to Admin</Link>
				</div>
				<div className="flex gap-3 flex-wrap">
					<button onClick={() => setTab("2023")} className={`px-3 py-1 rounded-full ${tab === "2023" ? "bg-primary-yellow text-black" : "bg-white/10"}`}>Founders Fest 2023</button>
					<button onClick={() => setTab("2024")} className={`px-3 py-1 rounded-full ${tab === "2024" ? "bg-primary-yellow text-black" : "bg-white/10"}`}>Founders Fest 2024</button>
					<button onClick={() => setTab("new")} className={`px-3 py-1 rounded-full ${tab === "new" ? "bg-primary-yellow text-black" : "bg-white/10"}`}>New Sections</button>
					<button onClick={() => setTab("team")} className={`px-3 py-1 rounded-full ${tab === "team" ? "bg-primary-yellow text-black" : "bg-white/10"}`}>Team</button>
				</div>

				{section && (
					<>
						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<h2 className="text-xl font-semibold">Section Settings</h2>
							<div className="flex flex-wrap items-center gap-4">
								<label className="flex items-center gap-2">
									<input type="checkbox" checked={!!section.section_enabled} onChange={(e) => save({ section_enabled: e.target.checked })} /> Enable section
								</label>
								<label className="flex items-center gap-2">
									<input type="checkbox" checked={!!section.rotation_enabled} onChange={(e) => save({ rotation_enabled: e.target.checked })} /> Enable rotation
								</label>
								<label className="flex items-center gap-2">
									<input type="checkbox" checked={!!section.hover_zoom_enabled} onChange={(e) => save({ hover_zoom_enabled: e.target.checked })} /> Enable hover zoom
								</label>
							</div>
							<div className="flex items-center gap-3">
								<label className="text-white/80">Rotation speed</label>
								<input type="number" min={4} max={60} value={section.rotation_speed} onChange={(e) => save({ rotation_speed: Number(e.target.value) })} className="w-24 rounded-md bg-black/40 border border-white/10 p-2" />
							</div>
						</section>

						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Metrics Manager</h2>
								<button onClick={addMetric} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Metric</button>
							</div>
							{section.metrics.sort((a, b) => (a.order || 0) - (b.order || 0)).map((m, idx) => (
								<div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
									<input value={m.title} onChange={(e) => updateMetric(idx, { ...m, title: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Title" />
									<input value={m.value} onChange={(e) => updateMetric(idx, { ...m, value: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Value" />
									<button onClick={() => moveMetric(idx, -1)} className="px-2 py-1 bg-white/10 rounded-full">Up</button>
									<button onClick={() => moveMetric(idx, 1)} className="px-2 py-1 bg-white/10 rounded-full">Down</button>
									<button onClick={() => updateMetric(idx, { ...m, visible: m.visible === false ? true : false })} className="px-2 py-1 bg-white/10 rounded-full">{m.visible === false ? "Enable" : "Disable"}</button>
									<button onClick={() => deleteMetric(idx)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
								</div>
							))}
						</section>

						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Image Manager</h2>
								<button onClick={addImage} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Image</button>
							</div>
							{section.images.sort((a, b) => (a.order || 0) - (b.order || 0)).map((img, idx) => (
								<div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
									<input value={img.url} onChange={(e) => updateImage(idx, { ...img, url: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Image URL (.jpg/.jpeg/.png/.webp)" />
									<input value={img.alt || ''} onChange={(e) => updateImage(idx, { ...img, alt: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="ALT text" />
									<button onClick={() => moveImage(idx, -1)} className="px-2 py-1 bg-white/10 rounded-full">Up</button>
									<button onClick={() => moveImage(idx, 1)} className="px-2 py-1 bg-white/10 rounded-full">Down</button>
									<button onClick={() => updateImage(idx, { ...img, visible: img.visible === false ? true : false })} className="px-2 py-1 bg-white/10 rounded-full">{img.visible === false ? "Enable" : "Disable"}</button>
									<button onClick={() => deleteImage(idx)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
								</div>
							))}
						</section>
					</>
				)}

				{tab === "new" && (
					<>
						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<h2 className="text-xl font-semibold">Page Sections Content</h2>
							<p className="text-white/70 text-sm mb-4">Manage all text content for the new about page sections</p>
							{Object.entries(pageSections).map(([key, value]) => (
								<div key={key} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3 items-center border-b border-white/10 pb-3 mb-3">
									<input value={key} readOnly className="w-full rounded-md bg-black/40 border border-white/10 p-2 opacity-70 text-sm" />
									<textarea
										value={value}
										onChange={async (e) => {
											setPageSections((prev) => ({ ...prev, [key]: e.target.value }));
											await supabase.from('about_page_sections').upsert({ key, value: e.target.value }, { onConflict: 'key' });
										}}
										rows={key.includes('content') || key.includes('quote') ? 3 : 1}
										className="w-full rounded-md bg-black/40 border border-white/10 p-2"
									/>
								</div>
							))}
						</section>

						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Simple Idea Images</h2>
								<button
									onClick={async () => {
										await supabase.from('about_page_images').insert([{ section_key: 'simple_idea', url: '', alt: '', visible: true, order: simpleIdeaImages.length }]);
										loadNewSections();
									}}
									className="bg-primary-yellow text-black px-3 py-1 rounded-full"
								>
									Add Image
								</button>
							</div>
							{simpleIdeaImages.map((img) => (
								<div key={img.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
									<input value={img.url} onChange={async (e) => { await supabase.from('about_page_images').update({ url: e.target.value }).eq('id', img.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Image URL" />
									<input value={img.alt || ''} onChange={async (e) => { await supabase.from('about_page_images').update({ alt: e.target.value }).eq('id', img.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="ALT text" />
									<button onClick={async () => { await supabase.from('about_page_images').update({ visible: !img.visible }).eq('id', img.id); loadNewSections(); }} className="px-2 py-1 bg-white/10 rounded-full">{img.visible === false ? 'Enable' : 'Disable'}</button>
									<button onClick={async () => { await supabase.from('about_page_images').delete().eq('id', img.id); loadNewSections(); }} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
								</div>
							))}
						</section>

						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">EdVenture Park Metrics</h2>
								<button
									onClick={async () => {
										await supabase.from('edventure_park_metrics').insert([{ icon: 'rocket', value: '0+', label: 'Label', visible: true, order: edventureMetrics.length }]);
										loadNewSections();
									}}
									className="bg-primary-yellow text-black px-3 py-1 rounded-full"
								>
									Add Metric
								</button>
							</div>
							{edventureMetrics.map((m) => (
								<div key={m.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
									<select value={m.icon || ''} onChange={async (e) => { await supabase.from('edventure_park_metrics').update({ icon: e.target.value }).eq('id', m.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2">
										<option value="rocket">🚀 Rocket</option>
										<option value="graduation">🎓 Graduation</option>
										<option value="briefcase">💼 Briefcase</option>
									</select>
									<input value={m.value} onChange={async (e) => { await supabase.from('edventure_park_metrics').update({ value: e.target.value }).eq('id', m.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Value" />
									<input value={m.label} onChange={async (e) => { await supabase.from('edventure_park_metrics').update({ label: e.target.value }).eq('id', m.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Label" />
									<button onClick={async () => { await supabase.from('edventure_park_metrics').update({ visible: !m.visible }).eq('id', m.id); loadNewSections(); }} className="px-2 py-1 bg-white/10 rounded-full">{m.visible === false ? 'Enable' : 'Disable'}</button>
									<button onClick={async () => { await supabase.from('edventure_park_metrics').delete().eq('id', m.id); loadNewSections(); }} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
								</div>
							))}
						</section>

						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Testimonials</h2>
								<button
									onClick={async () => {
										await supabase.from('about_testimonials').insert([{ quote: 'Quote', author_name: 'Name', author_title: 'Title', gradient_color: 'blue-green', visible: true, order: testimonials.length }]);
										loadNewSections();
									}}
									className="bg-primary-yellow text-black px-3 py-1 rounded-full"
								>
									Add Testimonial
								</button>
							</div>
							{testimonials.map((t) => (
								<div key={t.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
									<textarea value={t.quote} onChange={async (e) => { await supabase.from('about_testimonials').update({ quote: e.target.value }).eq('id', t.id); loadNewSections(); }} rows={2} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Quote" />
									<input value={t.author_name} onChange={async (e) => { await supabase.from('about_testimonials').update({ author_name: e.target.value }).eq('id', t.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Author Name" />
									<input value={t.author_title} onChange={async (e) => { await supabase.from('about_testimonials').update({ author_title: e.target.value }).eq('id', t.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Author Title" />
									<input value={t.author_image_url || ''} onChange={async (e) => { await supabase.from('about_testimonials').update({ author_image_url: e.target.value }).eq('id', t.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Image URL" />
									<select value={t.gradient_color || ''} onChange={async (e) => { await supabase.from('about_testimonials').update({ gradient_color: e.target.value }).eq('id', t.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2">
										<option value="blue-green">Blue-Green</option>
										<option value="pink-orange">Pink-Orange</option>
									</select>
									<button onClick={async () => { await supabase.from('about_testimonials').update({ visible: !t.visible }).eq('id', t.id); loadNewSections(); }} className="px-2 py-1 bg-white/10 rounded-full">{t.visible === false ? 'Enable' : 'Disable'}</button>
									<button onClick={async () => { await supabase.from('about_testimonials').delete().eq('id', t.id); loadNewSections(); }} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
								</div>
							))}
						</section>

						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Impact Stats</h2>
								<button
									onClick={async () => {
										await supabase.from('about_impact_stats').insert([{ value: '0+', label: 'Label', visible: true, order: impactStats.length }]);
										loadNewSections();
									}}
									className="bg-primary-yellow text-black px-3 py-1 rounded-full"
								>
									Add Stat
								</button>
							</div>
							{impactStats.map((s) => (
								<div key={s.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
									<input value={s.value} onChange={async (e) => { await supabase.from('about_impact_stats').update({ value: e.target.value }).eq('id', s.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Value" />
									<input value={s.label} onChange={async (e) => { await supabase.from('about_impact_stats').update({ label: e.target.value }).eq('id', s.id); loadNewSections(); }} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Label" />
									<button onClick={async () => { await supabase.from('about_impact_stats').update({ visible: !s.visible }).eq('id', s.id); loadNewSections(); }} className="px-2 py-1 bg-white/10 rounded-full">{s.visible === false ? 'Enable' : 'Disable'}</button>
									<button onClick={async () => { await supabase.from('about_impact_stats').delete().eq('id', s.id); loadNewSections(); }} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
								</div>
							))}
						</section>
					</>
				)}

				{tab === "team" && (
					<>
						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Team Members</h2>
								<button onClick={async () => {
									await supabase.from("team_members").insert([{ name: "New Member", designation: "Role", visible: true }]);
									loadTeam();
								}} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Member</button>
							</div>
							{members.map((m, idx) => {
								const saveMember = async (updated: Member) => {
									if (!updated.id) return;
									await supabase.from("team_members").update(updated).eq("id", updated.id);
									loadTeam();
								};
								const deleteMember = async (id?: number) => {
									if (!id) return;
									await supabase.from("team_members").delete().eq("id", id);
									loadTeam();
								};
								const toggleMember = async (id?: number, current?: boolean | null) => {
									if (!id) return;
									await supabase.from("team_members").update({ visible: !current }).eq("id", id);
									loadTeam();
								};
								const moveMember = async (index: number, dir: -1 | 1) => {
									const t = index + dir;
									if (t < 0 || t >= members.length) return;
									const a = members[index], b = members[t];
									const aOrder = a.order ?? index, bOrder = b.order ?? t;
									await supabase.from("team_members").update({ order: bOrder }).eq("id", a.id);
									await supabase.from("team_members").update({ order: aOrder }).eq("id", b.id);
									loadTeam();
								};
								return (
									<div key={m.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
										<input value={m.name} onChange={(e) => saveMember({ ...m, name: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Name" />
										<input value={m.designation} onChange={(e) => saveMember({ ...m, designation: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Designation" />
										<input value={m.responsibility || ""} onChange={(e) => saveMember({ ...m, responsibility: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Responsibility" />
										<input value={m.social_url || ""} onChange={(e) => saveMember({ ...m, social_url: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Social URL" />
										<input value={m.image || ""} onChange={(e) => saveMember({ ...m, image: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Image URL" />
										<button onClick={() => moveMember(idx, -1)} className="px-2 py-1 bg-white/10 rounded-full">Up</button>
										<button onClick={() => moveMember(idx, 1)} className="px-2 py-1 bg-white/10 rounded-full">Down</button>
										<button onClick={() => toggleMember(m.id, m.visible)} className="px-2 py-1 bg-white/10 rounded-full">{m.visible === false ? "Enable" : "Disable"}</button>
										<button onClick={() => deleteMember(m.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
									</div>
								);
							})}
						</section>
					</>
				)}
				</AdminGuard>
			</main>
		</div>
	);
}


