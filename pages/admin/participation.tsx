import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type WhyBullet = { id?: number; text: string; icon?: string | null; visible?: boolean | null; order?: number | null };
type WhyParagraph = { id?: number; text: string; order?: number | null; visible?: boolean | null };
type Benefit = { id?: number; title: string; description: string; icon?: string | null; visible?: boolean | null; order?: number | null };
type Complimentary = { id?: number; title: string; icon?: string | null; visible?: boolean | null; order?: number | null };

export default function AdminParticipation() {
	const [bullets, setBullets] = useState<WhyBullet[]>([]);
	const [paras, setParas] = useState<WhyParagraph[]>([]);
	const [benefits, setBenefits] = useState<Benefit[]>([]);
	const [complimentaries, setComplimentaries] = useState<Complimentary[]>([]);

	const reload = async () => {
		const [bRes, pRes, bnRes, cRes] = await Promise.all([
			supabase.from("participate_why_bullets").select("*").order("order", { ascending: true }),
			supabase.from("participate_why_paragraphs").select("*").order("order", { ascending: true }),
			supabase.from("participate_benefits").select("*").order("order", { ascending: true }),
			supabase.from("participate_complementary").select("*").order("order", { ascending: true }),
		]);
		setBullets((bRes.data || []) as WhyBullet[]);
		setParas((pRes.data || []) as WhyParagraph[]);
		setBenefits((bnRes.data || []) as Benefit[]);
		setComplimentaries((cRes.data || []) as Complimentary[]);
	};

	useEffect(() => {
		reload();
	}, []);

	const addBullet = async () => {
		await supabase.from("participate_why_bullets").insert([{ text: "New point", visible: true }]);
		reload();
	};
	const updateBullet = async (b: WhyBullet) => {
		await supabase.from("participate_why_bullets").update(b).eq("id", b.id);
	};
	const deleteBullet = async (id?: number) => {
		if (!id) return;
		await supabase.from("participate_why_bullets").delete().eq("id", id);
		reload();
	};

	const addPara = async () => {
		await supabase.from("participate_why_paragraphs").insert([{ text: "New paragraph", visible: true }]);
		reload();
	};
	const updatePara = async (p: WhyParagraph) => {
		await supabase.from("participate_why_paragraphs").update(p).eq("id", p.id);
	};
	const deletePara = async (id?: number) => {
		if (!id) return;
		await supabase.from("participate_why_paragraphs").delete().eq("id", id);
		reload();
	};

	const addBenefit = async () => {
		await supabase.from("participate_benefits").insert([{ title: "New benefit", description: "Description", visible: true }]);
		reload();
	};
	const updateBenefit = async (bn: Benefit) => {
		await supabase.from("participate_benefits").update(bn).eq("id", bn.id);
	};
	const deleteBenefit = async (id?: number) => {
		if (!id) return;
		await supabase.from("participate_benefits").delete().eq("id", id);
		reload();
	};

	const addComplimentary = async () => {
		await supabase.from("participate_complementary").insert([{ title: "New item", visible: true }]);
		reload();
	};
	const updateComplimentary = async (c: Complimentary) => {
		await supabase.from("participate_complementary").update(c).eq("id", c.id);
	};
	const deleteComplimentary = async (id?: number) => {
		if (!id) return;
		await supabase.from("participate_complementary").delete().eq("id", id);
		reload();
	};

	const toggleVisibility = async (table: string, id?: number, current?: boolean | null) => {
		if (!id) return;
		await supabase.from(table).update({ visible: !current }).eq("id", id);
		reload();
	};

	const moveItem = async (table: string, list: any[], index: number, dir: -1 | 1) => {
		const target = index + dir;
		if (target < 0 || target >= list.length) return;
		const a = list[index];
		const b = list[target];
		const aOrder = a.order ?? index;
		const bOrder = b.order ?? target;
		await supabase.from(table).update({ order: bOrder }).eq("id", a.id);
		await supabase.from(table).update({ order: aOrder }).eq("id", b.id);
		reload();
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head><title>Dashboard – Business Participation Settings</title></Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
				<AdminGuard>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-primary-yellow">Business Participation Settings</h1>
					<Link href="/admin" className="text-sm text-primary-yellow underline">Back to Admin</Link>
				</div>

				{/* Why Us: Paragraphs */}
				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Why Us – Paragraphs</h2>
						<button onClick={addPara} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Paragraph</button>
					</div>
					{paras.map((p, idx) => (
						<div key={p.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 items-start border-b border-white/10 pb-3 mb-3">
							<textarea
								value={p.text}
								onChange={(e) => setParas((arr) => arr.map((x) => x.id === p.id ? { ...x, text: e.target.value } : x))}
								onBlur={() => updatePara(p)}
								className="w-full rounded-md bg-black/40 border border-white/10 p-3"
								rows={2}
							/>
							<div className="flex gap-2 justify-end">
								<button onClick={() => moveItem("participate_why_paragraphs", paras, idx, -1)} className="px-2 py-1 bg-white/10 rounded-full">Up</button>
								<button onClick={() => moveItem("participate_why_paragraphs", paras, idx, 1)} className="px-2 py-1 bg-white/10 rounded-full">Down</button>
							</div>
							<button onClick={() => toggleVisibility("participate_why_paragraphs", p.id, p.visible)} className="px-2 py-1 bg-white/10 rounded-full">
								{p.visible === false ? "Enable" : "Disable"}
							</button>
							<button onClick={() => deletePara(p.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>

				{/* Why Us: Bullets */}
				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Why Us – Bullets</h2>
						<button onClick={addBullet} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Bullet</button>
					</div>
					{bullets.map((b, idx) => (
						<div key={b.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 items-start border-b border-white/10 pb-3 mb-3">
							<input
								value={b.text}
								onChange={(e) => setBullets((arr) => arr.map((x) => x.id === b.id ? { ...x, text: e.target.value } : x))}
								onBlur={() => updateBullet(b)}
								className="w-full rounded-md bg-black/40 border border-white/10 p-2"
								placeholder="Bullet text"
							/>
							<div className="flex gap-2 justify-end">
								<button onClick={() => moveItem("participate_why_bullets", bullets, idx, -1)} className="px-2 py-1 bg-white/10 rounded-full">Up</button>
								<button onClick={() => moveItem("participate_why_bullets", bullets, idx, 1)} className="px-2 py-1 bg-white/10 rounded-full">Down</button>
							</div>
							<button onClick={() => toggleVisibility("participate_why_bullets", b.id, b.visible)} className="px-2 py-1 bg-white/10 rounded-full">
								{b.visible === false ? "Enable" : "Disable"}
							</button>
							<button onClick={() => deleteBullet(b.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>

				{/* Benefits */}
				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Benefits</h2>
						<button onClick={addBenefit} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Benefit</button>
					</div>
					{benefits.map((bn, idx) => (
						<div key={bn.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 items-start border-b border-white/10 pb-3 mb-3">
							<input
								value={bn.title}
								onChange={(e) => setBenefits((arr) => arr.map((x) => x.id === bn.id ? { ...x, title: e.target.value } : x))}
								onBlur={() => updateBenefit(bn)}
								className="w-full rounded-md bg-black/40 border border-white/10 p-2"
								placeholder="Title"
							/>
							<input
								value={bn.description}
								onChange={(e) => setBenefits((arr) => arr.map((x) => x.id === bn.id ? { ...x, description: e.target.value } : x))}
								onBlur={() => updateBenefit(bn)}
								className="w-full rounded-md bg-black/40 border border-white/10 p-2"
								placeholder="Description"
							/>
							<div className="flex gap-2 justify-end">
								<button onClick={() => moveItem("participate_benefits", benefits, idx, -1)} className="px-2 py-1 bg-white/10 rounded-full">Up</button>
								<button onClick={() => moveItem("participate_benefits", benefits, idx, 1)} className="px-2 py-1 bg-white/10 rounded-full">Down</button>
							</div>
							<button onClick={() => toggleVisibility("participate_benefits", bn.id, bn.visible)} className="px-2 py-1 bg-white/10 rounded-full">
								{bn.visible === false ? "Enable" : "Disable"}
							</button>
							<button onClick={() => deleteBenefit(bn.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>

				{/* Complementary */}
				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Complementary</h2>
						<button onClick={addComplimentary} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Item</button>
					</div>
					{complimentaries.map((c, idx) => (
						<div key={c.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 items-start border-b border-white/10 pb-3 mb-3">
							<input
								value={c.title}
								onChange={(e) => setComplimentaries((arr) => arr.map((x) => x.id === c.id ? { ...x, title: e.target.value } : x))}
								onBlur={() => updateComplimentary(c)}
								className="w-full rounded-md bg-black/40 border border-white/10 p-2"
								placeholder="Item title"
							/>
							<div className="flex gap-2 justify-end">
								<button onClick={() => moveItem("participate_complementary", complimentaries, idx, -1)} className="px-2 py-1 bg-white/10 rounded-full">Up</button>
								<button onClick={() => moveItem("participate_complementary", complimentaries, idx, 1)} className="px-2 py-1 bg-white/10 rounded-full">Down</button>
							</div>
							<button onClick={() => toggleVisibility("participate_complementary", c.id, c.visible)} className="px-2 py-1 bg-white/10 rounded-full">
								{c.visible === false ? "Enable" : "Disable"}
							</button>
							<button onClick={() => deleteComplimentary(c.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>
				</AdminGuard>
			</main>
		</div>
	);
}


