import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Member = { id: number; name: string; designation: string; responsibility?: string | null; image?: string | null; social_url?: string | null; visible?: boolean | null; order?: number | null };

export default function TeamPage() {
	const [members, setMembers] = useState<Member[]>([]);
	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const { data } = await supabase.from("team_members").select("*").order("order", { ascending: true });
			if (!mounted) return;
			const m = (data || []) as Member[];
			setMembers(m.length ? m : [
				{ id: 1 as any, name: "Aisha Khan", designation: "Coordinator", responsibility: "Ops & Partners", image: "/rocket.png", social_url: "", visible: true, order: 0 },
				{ id: 2 as any, name: "Ravi Kumar", designation: "Lead Designer", responsibility: "Brand & Visuals", image: "/logo.png", social_url: "", visible: true, order: 1 },
			]);
		};
		load();
		return () => { mounted = false; };
	}, []);

	const visible = members.filter((m) => m.visible !== false);

	return (
		<>
			<Head><title>Team – Founders Fest</title></Head>
			<Navbar variant="floating" />
			<main className="pt-24 md:pt-28">
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-7xl">
						<motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-3xl md:text-5xl font-bold text-primary-yellow mb-10">Meet the Team</motion.h1>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
							{visible.map((m, idx) => (
								<motion.a
									key={m.id}
									href={m.social_url || "#"}
									target={m.social_url ? "_blank" : undefined}
									rel="noopener noreferrer"
									initial={{ opacity: 0, y: 12 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: idx * 0.03 }}
									className="group bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:translate-y-[-4px] transition-transform"
								>
									{m.image && <img src={m.image} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover mb-3 group-hover:scale-105 transition-transform" />}
									<div className="text-white font-semibold">{m.name}</div>
									<div className="text-white/70 text-sm">{m.designation}</div>
									{m.responsibility && <div className="text-white/60 text-xs mt-1">{m.responsibility}</div>}
								</motion.a>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}


