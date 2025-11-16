import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Partner = { id?: number; year: number; name: string; logo?: string | null; designation?: string | null; visible?: boolean | null; order?: number | null };

const Row = ({ p, onChange, onUp, onDown, onToggle, onDelete }: any) => (
	<div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
		<input value={p.name} onChange={(e) => onChange({ ...p, name: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Name" />
		<input value={p.logo || ""} onChange={(e) => onChange({ ...p, logo: e.target.value })} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Logo URL" />
		<button onClick={onUp} className="px-2 py-1 bg-white/10 rounded">Up</button>
		<button onClick={onDown} className="px-2 py-1 bg-white/10 rounded">Down</button>
		<button onClick={onToggle} className="px-2 py-1 bg-white/10 rounded">{p.visible === false ? "Enable" : "Disable"}</button>
		<button onClick={onDelete} className="px-2 py-1 bg-red-500/80 rounded">Delete</button>
	</div>
);

export default function AdminPartners() {
	const [tab, setTab] = useState<"2023" | "2024">("2023");
	const [gov, setGov] = useState<Partner[]>([]);
	const [sponsors, setSponsors] = useState<Partner[]>([]);
	const [influencers, setInfluencers] = useState<Partner[]>([]);

	const year = tab === "2023" ? 2023 : 2024;

	const reload = async () => {
		const [g, s, i] = await Promise.all([
			supabase.from("partners_gov").select("*").eq("year", year).order("order", { ascending: true }),
			supabase.from("partners_sponsors").select("*").eq("year", year).order("order", { ascending: true }),
			supabase.from("partners_influencers").select("*").eq("year", year).order("order", { ascending: true }),
		]);
		setGov((g.data || []) as Partner[]);
		setSponsors((s.data || []) as Partner[]);
		setInfluencers((i.data || []) as Partner[]);
	};

	useEffect(() => { reload(); }, [tab]);

	const addItem = async (table: string, setter: any, defaults: Partial<Partner> = {}) => {
		await supabase.from(table).insert([{ year, name: "New", visible: true, ...defaults }]);
		reload();
	};
	const saveItem = async (table: string, item: Partner) => {
		if (!item.id) return;
		await supabase.from(table).update(item).eq("id", item.id);
	};
	const deleteItem = async (table: string, id?: number) => {
		if (!id) return;
		await supabase.from(table).delete().eq("id", id);
		reload();
	};
	const toggleItem = async (table: string, id?: number, current?: boolean | null) => {
		if (!id) return;
		await supabase.from(table).update({ visible: !current }).eq("id", id);
		reload();
	};
	const moveItem = async (table: string, list: any[], index: number, dir: -1 | 1) => {
		const t = index + dir;
		if (t < 0 || t >= list.length) return;
		const a = list[index], b = list[t];
		const aOrder = a.order ?? index, bOrder = b.order ?? t;
		await supabase.from(table).update({ order: bOrder }).eq("id", a.id);
		await supabase.from(table).update({ order: aOrder }).eq("id", b.id);
		reload();
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head><title>Dashboard – Partners Page Settings</title></Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
				<AdminGuard>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-primary-yellow">Partners Page Settings</h1>
					<Link href="/admin" className="text-sm text-primary-yellow underline">Back to Admin</Link>
				</div>
				<div className="flex gap-3">
					<button onClick={() => setTab("2023")} className={`px-3 py-1 rounded ${tab === "2023" ? "bg-primary-yellow text-black" : "bg-white/10"}`}>Founders Fest 2023</button>
					<button onClick={() => setTab("2024")} className={`px-3 py-1 rounded ${tab === "2024" ? "bg-primary-yellow text-black" : "bg-white/10"}`}>Founders Fest 2024</button>
				</div>

				<section className="bg-white/5 rounded-xl p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">Government Partners</h2>
						<button onClick={() => addItem("partners_gov", setGov)} className="bg-primary-yellow text-black px-3 py-1 rounded">Add</button>
					</div>
					{gov.map((p, idx) => (
						<Row
							key={p.id}
							p={p}
							onChange={(v: Partner) => setGov((arr) => arr.map((x) => x.id === p.id ? (saveItem("partners_gov", v), v) : x))}
							onUp={() => moveItem("partners_gov", gov, idx, -1)}
							onDown={() => moveItem("partners_gov", gov, idx, 1)}
							onToggle={() => toggleItem("partners_gov", p.id, p.visible)}
							onDelete={() => deleteItem("partners_gov", p.id)}
						/>
					))}
				</section>

				<section className="bg-white/5 rounded-xl p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">Sponsors & Partners</h2>
						<button onClick={() => addItem("partners_sponsors", setSponsors)} className="bg-primary-yellow text-black px-3 py-1 rounded">Add</button>
					</div>
					{sponsors.map((p, idx) => (
						<Row
							key={p.id}
							p={p}
							onChange={(v: Partner) => setSponsors((arr) => arr.map((x) => x.id === p.id ? (saveItem("partners_sponsors", v), v) : x))}
							onUp={() => moveItem("partners_sponsors", sponsors, idx, -1)}
							onDown={() => moveItem("partners_sponsors", sponsors, idx, 1)}
							onToggle={() => toggleItem("partners_sponsors", p.id, p.visible)}
							onDelete={() => deleteItem("partners_sponsors", p.id)}
						/>
					))}
				</section>

				<section className="bg-white/5 rounded-xl p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">Speakers & Influencers</h2>
						<button onClick={() => addItem("partners_influencers", setInfluencers, { designation: "" })} className="bg-primary-yellow text-black px-3 py-1 rounded">Add</button>
					</div>
					{influencers.map((p, idx) => (
						<div key={p.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
							<input value={p.name} onChange={(e) => setInfluencers((arr) => arr.map((x) => x.id === p.id ? (saveItem("partners_influencers", { ...p, name: e.target.value }), { ...p, name: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Name" />
							<input value={p.designation || ""} onChange={(e) => setInfluencers((arr) => arr.map((x) => x.id === p.id ? (saveItem("partners_influencers", { ...p, designation: e.target.value }), { ...p, designation: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Designation" />
							<input value={p.logo || ""} onChange={(e) => setInfluencers((arr) => arr.map((x) => x.id === p.id ? (saveItem("partners_influencers", { ...p, logo: e.target.value }), { ...p, logo: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Image URL" />
							<button onClick={() => moveItem("partners_influencers", influencers, idx, -1)} className="px-2 py-1 bg-white/10 rounded">Up</button>
							<button onClick={() => moveItem("partners_influencers", influencers, idx, 1)} className="px-2 py-1 bg-white/10 rounded">Down</button>
							<button onClick={() => toggleItem("partners_influencers", p.id, p.visible)} className="px-2 py-1 bg-white/10 rounded">{p.visible === false ? "Enable" : "Disable"}</button>
							<button onClick={() => deleteItem("partners_influencers", p.id)} className="px-2 py-1 bg-red-500/80 rounded">Delete</button>
						</div>
					))}
				</section>
				</AdminGuard>
			</main>
		</div>
	);
}


