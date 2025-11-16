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

export default function AdminAbout() {
	const [tab, setTab] = useState<"2023" | "2024">("2023");
	const [section, setSection] = useState<Section | null>(null);
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

	useEffect(() => { load(); }, [tab]);

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
				<div className="flex gap-3">
					<button onClick={() => setTab("2023")} className={`px-3 py-1 rounded ${tab === "2023" ? "bg-primary-yellow text-black" : "bg-white/10"}`}>Founders Fest 2023</button>
					<button onClick={() => setTab("2024")} className={`px-3 py-1 rounded ${tab === "2024" ? "bg-primary-yellow text-black" : "bg-white/10"}`}>Founders Fest 2024</button>
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
								<button onClick={addMetric} className="bg-primary-yellow text-black px-3 py-1 rounded">Add Metric</button>
							</div>
							{section.metrics.sort((a, b) => (a.order || 0) - (b.order || 0)).map((m, idx) => (
								<div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
									<input value={m.title} onChange={(e) => updateMetric(idx, { ...m, title: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Title" />
									<input value={m.value} onChange={(e) => updateMetric(idx, { ...m, value: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Value" />
									<button onClick={() => moveMetric(idx, -1)} className="px-2 py-1 bg-white/10 rounded">Up</button>
									<button onClick={() => moveMetric(idx, 1)} className="px-2 py-1 bg-white/10 rounded">Down</button>
									<button onClick={() => updateMetric(idx, { ...m, visible: m.visible === false ? true : false })} className="px-2 py-1 bg-white/10 rounded">{m.visible === false ? "Enable" : "Disable"}</button>
									<button onClick={() => deleteMetric(idx)} className="px-2 py-1 bg-red-500/80 rounded">Delete</button>
								</div>
							))}
						</section>

						<section className="bg-white/5 rounded-xl p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Image Manager</h2>
								<button onClick={addImage} className="bg-primary-yellow text-black px-3 py-1 rounded">Add Image</button>
							</div>
							{section.images.sort((a, b) => (a.order || 0) - (b.order || 0)).map((img, idx) => (
								<div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
									<input value={img.url} onChange={(e) => updateImage(idx, { ...img, url: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Image URL (.jpg/.jpeg/.png/.webp)" />
									<input value={img.alt || ''} onChange={(e) => updateImage(idx, { ...img, alt: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="ALT text" />
									<button onClick={() => moveImage(idx, -1)} className="px-2 py-1 bg-white/10 rounded">Up</button>
									<button onClick={() => moveImage(idx, 1)} className="px-2 py-1 bg-white/10 rounded">Down</button>
									<button onClick={() => updateImage(idx, { ...img, visible: img.visible === false ? true : false })} className="px-2 py-1 bg-white/10 rounded">{img.visible === false ? "Enable" : "Disable"}</button>
									<button onClick={() => deleteImage(idx)} className="px-2 py-1 bg-red-500/80 rounded">Delete</button>
								</div>
							))}
						</section>
					</>
				)}
				</AdminGuard>
			</main>
		</div>
	);
}


