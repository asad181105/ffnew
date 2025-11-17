import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type KV = { key: string; value: string };
type Query = { id: number; created_at: string; name: string; whatsapp: string; query: string };

export default function AdminContact() {
	const [items, setItems] = useState<KV[]>([]);
	const [queries, setQueries] = useState<Query[]>([]);
	const [newKey, setNewKey] = useState("");
	const [newValue, setNewValue] = useState("");

	const reload = async () => {
		const [infoRes, qRes] = await Promise.all([
			supabase.from("contact_info").select("*"),
			supabase.from("contact_queries").select("*").order("created_at", { ascending: false }),
		]);
		setItems((infoRes.data || []) as any[]);
		setQueries((qRes.data || []) as any[]);
	};
	useEffect(() => { reload(); }, []);

	const addItem = async () => {
		if (!newKey) return;
		await supabase.from("contact_info").insert([{ key: newKey, value: newValue }]);
		setNewKey(""); setNewValue("");
		reload();
	};
	const saveItem = async (k: string, v: string) => {
		await supabase.from("contact_info").upsert({ key: k, value: v }, { onConflict: "key" });
	};
	const deleteItem = async (k: string) => {
		await supabase.from("contact_info").delete().eq("key", k);
		reload();
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head><title>Dashboard – Contact</title></Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
				<AdminGuard>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-primary-yellow">Contact Settings</h1>
					<Link href="/admin" className="text-sm text-primary-yellow underline">Back to Admin</Link>
				</div>

				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<h2 className="text-xl font-semibold">Contact Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
						<input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="key (e.g., phone1, email, address, venue, datetime, instagram, linkedin)" className="w-full rounded-md bg-black/40 border border-white/10 p-2" />
						<input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="value" className="w-full rounded-md bg-black/40 border border-white/10 p-2" />
						<button onClick={addItem} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add</button>
					</div>
					{items.map((it) => (
						<div key={it.key} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
							<input value={it.key} readOnly className="w-full rounded-md bg-black/40 border border-white/10 p-2 opacity-70" />
							<input value={it.value} onChange={(e) => setItems((arr) => arr.map((x) => x.key === it.key ? (saveItem(it.key, e.target.value), { ...x, value: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" />
							<button onClick={() => deleteItem(it.key)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>

				<section className="bg-white/5 rounded-xl p-6 space-y-4">
					<h2 className="text-xl font-semibold">Contact Queries</h2>
					<div className="overflow-auto">
						<table className="min-w-full text-sm">
							<thead className="bg-white/10">
								<tr>
									<th className="text-left px-3 py-2">Date</th>
									<th className="text-left px-3 py-2">Name</th>
									<th className="text-left px-3 py-2">WhatsApp</th>
									<th className="text-left px-3 py-2">Query</th>
								</tr>
							</thead>
							<tbody>
								{queries.map((q) => (
									<tr key={q.id} className="border-t border-white/10">
										<td className="px-3 py-2">{new Date(q.created_at).toLocaleString()}</td>
										<td className="px-3 py-2">{q.name}</td>
										<td className="px-3 py-2">{q.whatsapp}</td>
										<td className="px-3 py-2">{q.query}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
				</AdminGuard>
			</main>
		</div>
	);
}


