import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Winner = { id: number; name: string; title: string; image?: string | null; visible?: boolean | null; order?: number | null };
type RichText = { id: number; content: string };

export default function AwardsPage() {
	const [winners, setWinners] = useState<Winner[]>([]);
	const [why, setWhy] = useState<string>("");

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const [winRes, whyRes] = await Promise.all([
				supabase.from("awards_winners").select("*").order("order", { ascending: true }),
				supabase.from("awards_content").select("*").eq("key", "why_awards").single(),
			]);
			if (!mounted) return;
			const w = (winRes.data || []) as Winner[];
			setWinners(w.length ? w : [
				{ id: 1 as any, name: "Acme Innovations", title: "Startup of the Year", image: "/rocket.png", visible: true, order: 0 },
			]);
			if (whyRes.data?.value) setWhy(String(whyRes.data.value));
			else setWhy("<p>Awards celebrate resilience, innovation, and real impact—recognizing those who move communities forward.</p>");
		};
		load();
		return () => { mounted = false; };
	}, []);

	const visible = winners.filter((w) => w.visible !== false);

	return (
		<>
			<Head>
				<title>Awards – Founders Fest</title>
				<meta name="description" content="Awards, last year winners, and nomination at Founders Fest." />
			</Head>
			<Navbar />
			<main className="pt-20">
				{/* Last Year Winners */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-3xl md:text-4xl font-bold text-primary-yellow mb-8">Last Year Award Winners</motion.h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
							{visible.map((w, idx) => (
								<motion.div key={w.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.05 }} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
									{w.image && <img src={w.image} alt={w.name} className="mx-auto h-36 w-36 rounded-full object-cover mb-4" />}
									<div className="text-white font-semibold">{w.name}</div>
									<div className="text-white/70">{w.title}</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Why Awards */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-4xl">
						<motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6">Why Awards Are Necessary</motion.h2>
						<div className="bg-white/5 border border-white/10 rounded-xl p-6">
							<div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: why }} />
						</div>
					</div>
				</section>

				{/* Nominate CTA */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-5xl text-center">
						<Link href="/awards/nominate" className="inline-block bg-primary-yellow text-black font-semibold px-6 py-3 rounded-md hover:opacity-90">Nominate Yourself</Link>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}


