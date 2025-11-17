import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Member = { id?: number; name: string; designation: string; responsibility?: string | null; image?: string | null; social_url?: string | null; visible?: boolean | null; order?: number | null };

export default function AdminTeam() {
	const [members, setMembers] = useState<Member[]>([]);

	const reload = async () => {
		const { data } = await supabase.from("team_members").select("*").order("order", { ascending: true });
		setMembers((data || []) as Member[]);
	};
	useEffect(() => { reload(); }, []);

	const addMember = async () => {
		await supabase.from("team_members").insert([{ name: "New Member", designation: "Role", visible: true }]);
		reload();
	};
	const saveMember = async (m: Member) => {
		if (!m.id) return;
		await supabase.from("team_members").update(m).eq("id", m.id);
	};
	const deleteMember = async (id?: number) => {
		if (!id) return;
		await supabase.from("team_members").delete().eq("id", id);
		reload();
	};
	const toggleMember = async (id?: number, current?: boolean | null) => {
		if (!id) return;
		await supabase.from("team_members").update({ visible: !current }).eq("id", id);
		reload();
	};
	const moveMember = async (index: number, dir: -1 | 1) => {
		const t = index + dir;
		if (t < 0 || t >= members.length) return;
		const a = members[index], b = members[t];
		const aOrder = a.order ?? index, bOrder = b.order ?? t;
		await supabase.from("team_members").update({ order: bOrder }).eq("id", a.id);
		await supabase.from("team_members").update({ order: aOrder }).eq("id", b.id);
		reload();
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head><title>Dashboard – Team Members</title></Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
				<AdminGuard>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-primary-yellow">Team Members</h1>
					<div className="flex items-center gap-3">
						<Link href="/admin" className="text-sm text-primary-yellow underline">Back to Admin</Link>
						<button onClick={addMember} className="bg-primary-yellow text-black px-3 py-1 rounded-full">Add Member</button>
					</div>
				</div>
				<section className="bg-white/5 rounded-xl p-6">
					{members.map((m, idx) => (
						<div key={m.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto_auto_auto_auto] gap-3 items-center border-b border-white/10 pb-3 mb-3">
							<input value={m.name} onChange={(e) => setMembers((arr) => arr.map((x) => x.id === m.id ? (saveMember({ ...m, name: e.target.value }), { ...m, name: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Name" />
							<input value={m.designation} onChange={(e) => setMembers((arr) => arr.map((x) => x.id === m.id ? (saveMember({ ...m, designation: e.target.value }), { ...m, designation: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Designation" />
							<input value={m.responsibility || ""} onChange={(e) => setMembers((arr) => arr.map((x) => x.id === m.id ? (saveMember({ ...m, responsibility: e.target.value }), { ...m, responsibility: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Responsibility" />
							<input value={m.social_url || ""} onChange={(e) => setMembers((arr) => arr.map((x) => x.id === m.id ? (saveMember({ ...m, social_url: e.target.value }), { ...m, social_url: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Social URL" />
							<input value={m.image || ""} onChange={(e) => setMembers((arr) => arr.map((x) => x.id === m.id ? (saveMember({ ...m, image: e.target.value }), { ...m, image: e.target.value }) : x))} className="w-full rounded-md bg-black/40 border border-white/10 p-2" placeholder="Image URL" />
							<button onClick={() => moveMember(idx, -1)} className="px-2 py-1 bg-white/10 rounded-full">Up</button>
							<button onClick={() => moveMember(idx, 1)} className="px-2 py-1 bg-white/10 rounded-full">Down</button>
							<button onClick={() => toggleMember(m.id, m.visible)} className="px-2 py-1 bg-white/10 rounded-full">{m.visible === false ? "Enable" : "Disable"}</button>
							<button onClick={() => deleteMember(m.id)} className="px-2 py-1 bg-red-500/80 rounded-full">Delete</button>
						</div>
					))}
				</section>
				</AdminGuard>
			</main>
		</div>
	);
}


