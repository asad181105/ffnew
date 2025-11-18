import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";

type Winner = { id: number; name: string; title: string; image?: string | null; visible?: boolean | null; order?: number | null };
type RichText = { id: number; content: string };
type SpotlightBenefit = { id: number; title: string; description: string; order?: number | null; visible?: boolean | null };
type NominationStep = { id: number; title: string; description: string; order?: number | null; visible?: boolean | null };

export default function AwardsPage() {
	const [winners, setWinners] = useState<Winner[]>([]);
	const [why, setWhy] = useState<string>("");
	const [pageContent, setPageContent] = useState<Record<string, string>>({});
	const [spotlightBenefits, setSpotlightBenefits] = useState<SpotlightBenefit[]>([]);
	const [nominationSteps, setNominationSteps] = useState<NominationStep[]>([]);
	const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const [winRes, whyRes, contentRes, benefitsRes, stepsRes, catRes] = await Promise.all([
				supabase.from("awards_winners").select("*").order("order", { ascending: true }),
				supabase.from("awards_content").select("*").eq("key", "why_awards").single(),
				supabase.from("awards_page_content").select("*"),
				supabase.from("awards_spotlight_benefits").select("*").order("order", { ascending: true }),
				supabase.from("awards_nomination_steps").select("*").order("order", { ascending: true }),
				supabase.from("award_categories").select("*").order("id", { ascending: true }),
			]);
			if (!mounted) return;
			const w = (winRes.data || []) as Winner[];
			setWinners(w.length ? w : [
				{ id: 1 as any, name: "Acme Innovations", title: "Startup of the Year", image: "/rocket.png", visible: true, order: 0 },
			]);
			if (whyRes.data?.value) setWhy(String(whyRes.data.value));
			else setWhy("<p>Awards celebrate resilience, innovation, and real impact—recognizing those who move communities forward.</p>");
			
			const contentMapped = (contentRes.data || []).reduce((acc: any, row: any) => {
				acc[row.key] = row.value;
				return acc;
			}, {});
			if (Object.keys(contentMapped).length === 0) {
				setPageContent({
					hero_title: "Show the World What You've Built.",
					hero_cta_text: "Nominate Your Startup!",
					spotlight_title: "Why Put Your Startup in the Spotlight?",
					past_winners_callout: "Join the ranks of past winners like Aura Health & FinTech Wave.",
					nominate_title: "Ready to Nominate?",
					nominate_subtitle: "Share your vision. Claim your spot.",
					nomination_deadline: "October 31, 2024",
					what_happens_title: "What Happens Next?",
				});
			} else {
				setPageContent(contentMapped);
			}
			
			const benefits = (benefitsRes.data || []) as SpotlightBenefit[];
			setSpotlightBenefits(benefits.length > 0 ? benefits : [
				{ id: 1 as any, title: "Recognition", description: "Gain industry-wide acclaim and media attention.", order: 0, visible: true },
				{ id: 2 as any, title: "Credibility", description: "Earn a powerful seal of approval from experts.", order: 1, visible: true },
				{ id: 3 as any, title: "Amplification", description: "Reach new partners and investors.", order: 2, visible: true },
				{ id: 4 as any, title: "Inspiration", description: "Motivate the next wave of founders.", order: 3, visible: true },
			]);
			
			const steps = (stepsRes.data || []) as NominationStep[];
			setNominationSteps(steps.length > 0 ? steps : [
				{ id: 1 as any, title: "Initial Screening", description: "Our team reviews all nominations for eligibility.", order: 0, visible: true },
				{ id: 2 as any, title: "Judging Panel", description: "Finalists are reviewed by a panel of industry experts.", order: 1, visible: true },
				{ id: 3 as any, title: "Winners Announcement", description: "Winners are revealed live at Founders Fest!", order: 2, visible: true },
			]);
			
			setCategories((catRes.data || []) as any[]);
		};
		load();
		return () => { mounted = false; };
	}, []);

	const visible = winners.filter((w) => w.visible !== false);
	const visibleBenefits = spotlightBenefits.filter((b) => b.visible !== false);
	const visibleSteps = nominationSteps.filter((s) => s.visible !== false);
	const visibleCategories = categories;


	return (
		<>
			<Head>
				<title>Awards – Founders Fest</title>
				<meta name="description" content="Awards, last year winners, and nomination at Founders Fest." />
			</Head>
			<Navbar variant="floating" />
			<main className="pt-20 md:pt-28">
				{/* Hero Section */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl text-center">
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl md:text-5xl font-bold text-primary-yellow mb-6"
						>
							{pageContent.hero_title || "Show the World What You've Built."}
						</motion.h1>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
						>
							<Link
								href="/awards/nominate"
								className="inline-block bg-primary-yellow text-black font-bold px-8 py-4 rounded-full text-lg md:text-xl hover:bg-primary-yellow/90 transition-colors"
							>
								{pageContent.hero_cta_text || "Nominate Your Startup!"}
							</Link>
						</motion.div>
					</div>
				</section>

				{/* Why Put Your Startup in the Spotlight */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl md:text-4xl font-bold text-primary-yellow mb-8"
						>
							{pageContent.spotlight_title || "Why Put Your Startup in the Spotlight?"}
						</motion.h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
							{visibleBenefits.map((benefit, idx) => (
								<motion.div
									key={benefit.id}
									initial={{ opacity: 0, y: 12 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: idx * 0.05 }}
									className="bg-white/5 border border-white/10 rounded-xl p-6"
								>
									<h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
									<p className="text-white/80">{benefit.description}</p>
								</motion.div>
							))}
						</div>
						{pageContent.past_winners_callout && (
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-center text-lg md:text-xl text-white/90 italic"
							>
								{pageContent.past_winners_callout}
							</motion.p>
						)}
					</div>
				</section>

				{/* Award Categories */}
				{visibleCategories.length > 0 && (
					<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
						<div className="container mx-auto max-w-6xl">
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-3xl md:text-4xl font-bold text-primary-yellow mb-8"
							>
								Award Categories
							</motion.h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
								{visibleCategories.map((cat, idx) => (
									<motion.div
										key={cat.id}
										initial={{ opacity: 0, y: 12 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: idx * 0.05 }}
										className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
									>
										<p className="text-white font-semibold">{cat.name}</p>
									</motion.div>
								))}
							</div>
							{visibleCategories.length > 0 && (
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-center text-white/70 mt-6"
								>
									…more categories coming soon
								</motion.p>
							)}
						</div>
					</section>
				)}

				{/* Ready to Nominate */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-4xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl md:text-4xl font-bold text-primary-yellow mb-4 text-center"
						>
							{pageContent.nominate_title || "Ready to Nominate?"}
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-center text-white/80 mb-8"
						>
							{pageContent.nominate_subtitle || "Share your vision. Claim your spot."}
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8"
						>
							<Link
								href="/awards/nominate"
								className="block w-full bg-primary-yellow text-black font-semibold px-6 py-3 rounded-full text-center hover:bg-primary-yellow/90 transition-colors"
							>
								Start Your Self-Nomination for 2025
							</Link>
						</motion.div>
						{pageContent.nomination_deadline && (
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-center text-white/70 mt-6"
							>
								<strong className="text-primary-yellow">Nomination Deadline:</strong> {pageContent.nomination_deadline}
							</motion.p>
						)}
					</div>
				</section>

				{/* What Happens Next */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl md:text-4xl font-bold text-primary-yellow mb-8"
						>
							{pageContent.what_happens_title || "What Happens Next?"}
						</motion.h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{visibleSteps.map((step, idx) => (
								<motion.div
									key={step.id}
									initial={{ opacity: 0, y: 12 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: idx * 0.1 }}
									className="bg-white/5 border border-white/10 rounded-xl p-6"
								>
									<div className="text-3xl font-bold text-primary-yellow mb-2">{idx + 1}.</div>
									<h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
									<p className="text-white/80">{step.description}</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Awards Images Slider */}
				{visible.filter(w => w.image).length > 0 && (
					<section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
						<div className="container mx-auto max-w-7xl">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
							>
							<ImageAutoSlider
								images={visible.filter(w => w.image).map(w => w.image!)}
								direction="left"
								speed={25}
								imageSize="md"
								className="py-8"
							/>
							</motion.div>
						</div>
					</section>
				)}

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
			</main>
			<Footer />
		</>
	);
}


