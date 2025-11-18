import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Winner = { id?: number; name: string; title: string; image?: string | null; visible?: boolean | null; order?: number | null };
type SpotlightBenefit = { id?: number; title: string; description: string; order?: number | null; visible?: boolean | null };
type NominationStep = { id?: number; title: string; description: string; order?: number | null; visible?: boolean | null };

export default function AdminAwards() {
	const [winners, setWinners] = useState<Winner[]>([]);
	const [why, setWhy] = useState<string>("");
	const [savingWhy, setSavingWhy] = useState(false);
	const [categories, setCategories] = useState<{ id?: number; name: string }[]>([]);
	const [pageContent, setPageContent] = useState<Record<string, string>>({});
	const [spotlightBenefits, setSpotlightBenefits] = useState<SpotlightBenefit[]>([]);
	const [nominationSteps, setNominationSteps] = useState<NominationStep[]>([]);

	const reload = async () => {
		const [winRes, whyRes, catRes, contentRes, benefitsRes, stepsRes] = await Promise.all([
			supabase.from("awards_winners").select("*").order("order", { ascending: true }),
			supabase.from("awards_content").select("*").eq("key", "why_awards").single(),
			supabase.from("award_categories").select("*").order("id", { ascending: true }),
			supabase.from("awards_page_content").select("*"),
			supabase.from("awards_spotlight_benefits").select("*").order("order", { ascending: true }),
			supabase.from("awards_nomination_steps").select("*").order("order", { ascending: true }),
		]);
		setWinners((winRes.data || []) as Winner[]);
		if (whyRes.data?.value) setWhy(String(whyRes.data.value));
		setCategories((catRes.data || []) as any[]);
		const contentMapped = (contentRes.data || []).reduce((acc: any, row: any) => {
			acc[row.key] = row.value;
			return acc;
		}, {});
		setPageContent(contentMapped);
		setSpotlightBenefits((benefitsRes.data || []) as SpotlightBenefit[]);
		setNominationSteps((stepsRes.data || []) as NominationStep[]);
	};

	useEffect(() => { reload(); }, []);

	const addWinner = async () => {
		await supabase.from("awards_winners").insert([{ name: "New Winner", title: "Award Title", visible: true }]);
		reload();
	};
	const saveWinner = async (w: Winner) => {
		if (!w.id) return;
		await supabase.from("awards_winners").update(w).eq("id", w.id);
	};
	const deleteWinner = async (id?: number) => {
		if (!id) return;
		await supabase.from("awards_winners").delete().eq("id", id);
		reload();
	};
	const toggleWinner = async (id?: number, curr?: boolean | null) => {
		if (!id) return;
		await supabase.from("awards_winners").update({ visible: !curr }).eq("id", id);
		reload();
	};
	const moveWinner = async (index: number, dir: -1 | 1) => {
		const t = index + dir;
		if (t < 0 || t >= winners.length) return;
		const a = winners[index], b = winners[t];
		const aOrder = a.order ?? index, bOrder = b.order ?? t;
		await supabase.from("awards_winners").update({ order: bOrder }).eq("id", a.id);
		await supabase.from("awards_winners").update({ order: aOrder }).eq("id", b.id);
		reload();
	};

	const saveWhy = async () => {
		setSavingWhy(true);
		await supabase.from("awards_content").upsert({ key: "why_awards", value: why }, { onConflict: "key" });
		setSavingWhy(false);
	};

	const addCategory = async () => {
		await supabase.from("award_categories").insert([{ name: "New Category" }]);
		reload();
	};
	const saveCategory = async (c: { id?: number; name: string }) => {
		if (!c.id) return;
		await supabase.from("award_categories").update(c).eq("id", c.id);
	};
	const deleteCategory = async (id?: number) => {
		if (!id) return;
		await supabase.from("award_categories").delete().eq("id", id);
		reload();
	};

	const savePageContent = async (k: string, v: string) => {
		await supabase.from("awards_page_content").upsert({ key: k, value: v }, { onConflict: "key" });
	};

	const addSpotlightBenefit = async () => {
		await supabase.from("awards_spotlight_benefits").insert([{ title: "New Benefit", description: "Description", visible: true, order: spotlightBenefits.length }]);
		reload();
	};
	const saveSpotlightBenefit = async (b: SpotlightBenefit) => {
		if (!b.id) return;
		await supabase.from("awards_spotlight_benefits").update(b).eq("id", b.id);
	};
	const deleteSpotlightBenefit = async (id?: number) => {
		if (!id) return;
		await supabase.from("awards_spotlight_benefits").delete().eq("id", id);
		reload();
	};
	const toggleSpotlightBenefit = async (id?: number, curr?: boolean | null) => {
		if (!id) return;
		await supabase.from("awards_spotlight_benefits").update({ visible: !curr }).eq("id", id);
		reload();
	};

	const addNominationStep = async () => {
		await supabase.from("awards_nomination_steps").insert([{ title: "New Step", description: "Description", visible: true, order: nominationSteps.length }]);
		reload();
	};
	const saveNominationStep = async (s: NominationStep) => {
		if (!s.id) return;
		await supabase.from("awards_nomination_steps").update(s).eq("id", s.id);
	};
	const deleteNominationStep = async (id?: number) => {
		if (!id) return;
		await supabase.from("awards_nomination_steps").delete().eq("id", id);
		reload();
	};
	const toggleNominationStep = async (id?: number, curr?: boolean | null) => {
		if (!id) return;
		await supabase.from("awards_nomination_steps").update({ visible: !curr }).eq("id", id);
		reload();
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head><title>Dashboard – Awards</title></Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
				<AdminGuard>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-primary-yellow">Awards Module</h1>
					<Link href="/admin" className="text-sm text-primary-yellow underline">Back to Admin</Link>
				</div>

				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Last Year Winners</h2>
						<button onClick={addWinner} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Winner</button>
					</div>
					{winners.map((w, idx) => (
						<div key={w.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
							<input value={w.name} onChange={(e) => setWinners((arr) => arr.map((x) => x.id === w.id ? (saveWinner({ ...w, name: e.target.value }), { ...w, name: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Name" />
							<input value={w.title} onChange={(e) => setWinners((arr) => arr.map((x) => x.id === w.id ? (saveWinner({ ...w, title: e.target.value }), { ...w, title: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Title of Award" />
							<input value={w.image || ""} onChange={(e) => setWinners((arr) => arr.map((x) => x.id === w.id ? (saveWinner({ ...w, image: e.target.value }), { ...w, image: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Image URL" />
							<button onClick={() => moveWinner(idx, -1)} className="px-2 py-1 bg-white/10 rounded-full">Up</button>
							<button onClick={() => moveWinner(idx, 1)} className="px-2 py-1 bg-white/10 rounded-full">Down</button>
							<button onClick={() => toggleWinner(w.id, w.visible)} className="px-2 py-1 bg-white/10 rounded-full">{w.visible === false ? "Enable" : "Disable"}</button>
							<button onClick={() => deleteWinner(w.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>

				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<h2 className="text-xl font-semibold mb-2">Why Awards Are Necessary</h2>
					<textarea value={why} onChange={(e) => setWhy(e.target.value)} rows={6} className="w-full rounded-md bg-black/40 border border-white/10 p-3" placeholder="Rich text (HTML) or plain text" />
					<button onClick={saveWhy} disabled={savingWhy} className="bg-primary-yellow text-black px-3 py-1 rounded-full">{savingWhy ? "Saving..." : "Save"}</button>
				</section>

				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<h2 className="text-xl font-semibold">Awards Page Content</h2>
					<p className="text-white/70 text-sm mb-4">Manage page content: hero_title, hero_cta_text, spotlight_title, past_winners_callout, nominate_title, nominate_subtitle, nomination_deadline, what_happens_title</p>
					{Object.entries(pageContent).map(([key, value]) => (
						<div key={key} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3 items-center border-b border-white/10 pb-3 mb-3">
							<input value={key} readOnly className="w-full rounded-md bg-black/40 border border-white/10 p-2 opacity-70 text-sm" />
							<textarea value={value} onChange={(e) => setPageContent((prev) => { savePageContent(key, e.target.value); return { ...prev, [key]: e.target.value }; })} rows={2} className="w-full rounded-md bg-black/40 border border-white/10 p-2" />
						</div>
					))}
				</section>

				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Spotlight Benefits</h2>
						<button onClick={addSpotlightBenefit} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Benefit</button>
					</div>
					{spotlightBenefits.map((b) => (
						<div key={b.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
							<input value={b.title} onChange={(e) => setSpotlightBenefits((arr) => arr.map((x) => x.id === b.id ? (saveSpotlightBenefit({ ...b, title: e.target.value }), { ...b, title: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Title" />
							<textarea value={b.description} onChange={(e) => setSpotlightBenefits((arr) => arr.map((x) => x.id === b.id ? (saveSpotlightBenefit({ ...b, description: e.target.value }), { ...b, description: e.target.value }) : x))} rows={2} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Description" />
							<button onClick={() => toggleSpotlightBenefit(b.id, b.visible)} className="px-2 py-1 bg-white/10 rounded-full">{b.visible === false ? "Enable" : "Disable"}</button>
							<button onClick={() => deleteSpotlightBenefit(b.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>

				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Nomination Steps</h2>
						<button onClick={addNominationStep} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Step</button>
					</div>
					{nominationSteps.map((s) => (
						<div key={s.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
							<input value={s.title} onChange={(e) => setNominationSteps((arr) => arr.map((x) => x.id === s.id ? (saveNominationStep({ ...s, title: e.target.value }), { ...s, title: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Title" />
							<textarea value={s.description} onChange={(e) => setNominationSteps((arr) => arr.map((x) => x.id === s.id ? (saveNominationStep({ ...s, description: e.target.value }), { ...s, description: e.target.value }) : x))} rows={2} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Description" />
							<button onClick={() => toggleNominationStep(s.id, s.visible)} className="px-2 py-1 bg-white/10 rounded-full">{s.visible === false ? "Enable" : "Disable"}</button>
							<button onClick={() => deleteNominationStep(s.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>

				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Award Categories</h2>
						<button onClick={addCategory} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Category</button>
					</div>
					{categories.map((c) => (
						<div key={c.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
							<input value={c.name} onChange={(e) => setCategories((arr) => arr.map((x) => x.id === c.id ? (saveCategory({ ...c, name: e.target.value }), { ...c, name: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Category name" />
							<button onClick={() => deleteCategory(c.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>
				</AdminGuard>
			</main>
		</div>
	);
}


