import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Partner = { id: number; name: string; logo?: string | null; designation?: string | null; visible?: boolean | null; order?: number | null };

export default function PartnersPage() {
	const [gov2023, setGov2023] = useState<Partner[]>([]);
	const [sponsors2023, setSponsors2023] = useState<Partner[]>([]);
	const [influencers2023, setInfluencers2023] = useState<Partner[]>([]);
	const [gov2024, setGov2024] = useState<Partner[]>([]);
	const [sponsors2024, setSponsors2024] = useState<Partner[]>([]);
	const [influencers2024, setInfluencers2024] = useState<Partner[]>([]);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const queries = [
				supabase.from("partners_gov").select("*").eq("year", 2023).order("order", { ascending: true }),
				supabase.from("partners_sponsors").select("*").eq("year", 2023).order("order", { ascending: true }),
				supabase.from("partners_influencers").select("*").eq("year", 2023).order("order", { ascending: true }),
				supabase.from("partners_gov").select("*").eq("year", 2024).order("order", { ascending: true }),
				supabase.from("partners_sponsors").select("*").eq("year", 2024).order("order", { ascending: true }),
				supabase.from("partners_influencers").select("*").eq("year", 2024).order("order", { ascending: true }),
			];
			const [g23, s23, i23, g24, s24, i24] = await Promise.all(queries);
			if (!mounted) return;
			const _g23 = (g23.data || []) as Partner[];
			const _s23 = (s23.data || []) as Partner[];
			const _i23 = (i23.data || []) as Partner[];
			const _g24 = (g24.data || []) as Partner[];
			const _s24 = (s24.data || []) as Partner[];
			const _i24 = (i24.data || []) as Partner[];
			setGov2023(_g23.length ? _g23 : [{ id: 1 as any, name: "Gov Dept.", logo: "/logo.png", visible: true, order: 0 }]);
			setSponsors2023(_s23.length ? _s23 : [{ id: 1 as any, name: "Sponsor A", logo: "/logo.png", visible: true, order: 0 }]);
			setInfluencers2023(_i23.length ? _i23 : [{ id: 1 as any, name: "Jane Doe", designation: "Speaker", logo: "/rocket.png", visible: true, order: 0 }]);
			setGov2024(_g24.length ? _g24 : [{ id: 1 as any, name: "Gov Dept.", logo: "/logo.png", visible: true, order: 0 }]);
			setSponsors2024(_s24.length ? _s24 : [{ id: 1 as any, name: "Sponsor B", logo: "/logo.png", visible: true, order: 0 }]);
			setInfluencers2024(_i24.length ? _i24 : [{ id: 1 as any, name: "John Smith", designation: "Influencer", logo: "/rocket.png", visible: true, order: 0 }]);
		};
		load();
		return () => { mounted = false; };
	}, []);

	const visible = <T extends { visible?: boolean | null }>(arr: T[]) => arr.filter((x) => x.visible !== false);

	const Section = ({ title, gov, sponsors, influencers }: { title: string; gov: Partner[]; sponsors: Partner[]; influencers: Partner[]; }) => (
		<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
			<div className="container mx-auto max-w-6xl">
				<motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-3xl md:text-4xl font-bold text-primary-yellow mb-8">{title}</motion.h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					<div>
						<h3 className="text-xl font-semibold text-white mb-4">Government Partners</h3>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{visible(gov).map((p) => (
								<div key={p.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-center">
									{p.logo ? <img src={p.logo} alt={p.name} className="max-h-16 object-contain" /> : <span className="text-white/80">{p.name}</span>}
								</div>
							))}
						</div>
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white mb-4">Sponsors & Partners</h3>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{visible(sponsors).map((p) => (
								<div key={p.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-center">
									{p.logo ? <img src={p.logo} alt={p.name} className="max-h-16 object-contain" /> : <span className="text-white/80">{p.name}</span>}
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="mt-10">
					<h3 className="text-xl font-semibold text-white mb-4">Speakers & Influencers</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{visible(influencers).map((p) => (
							<div key={p.id} className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
								{p.logo && <img src={p.logo} alt={p.name} className="mx-auto h-20 w-20 object-cover rounded-full mb-3" />}
								<div className="text-white font-medium">{p.name}</div>
								{p.designation && <div className="text-white/70 text-sm">{p.designation}</div>}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);

	return (
		<>
			<Head>
				<title>Partners – Founders Fest</title>
				<meta name="description" content="Partners, sponsors, and influencers of Founders Fest." />
			</Head>
			<Navbar />
			<main className="pt-20">
				<Section title="2023 Partners" gov={gov2023} sponsors={sponsors2023} influencers={influencers2023} />
				<Section title="2024 Partners" gov={gov2024} sponsors={sponsors2024} influencers={influencers2024} />
			</main>
			<Footer />
		</>
	);
}


