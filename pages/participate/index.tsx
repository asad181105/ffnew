import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type WhyBullet = { id: number; text: string; icon?: string | null; visible?: boolean | null; order?: number | null };
type WhyParagraph = { id: number; text: string; order?: number | null; visible?: boolean | null };
type Benefit = { id: number; title: string; description: string; icon?: string | null; visible?: boolean | null; order?: number | null };
type Complimentary = { id: number; title: string; icon?: string | null; visible?: boolean | null; order?: number | null };

export default function ParticipatePage() {
	const [bullets, setBullets] = useState<WhyBullet[]>([]);
	const [paras, setParas] = useState<WhyParagraph[]>([]);
	const [benefits, setBenefits] = useState<Benefit[]>([]);
	const [complimentaries, setComplimentaries] = useState<Complimentary[]>([]);
	const [carouselImages, setCarouselImages] = useState<string[]>([]);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const [bRes, pRes, bnRes, cRes, imgRes] = await Promise.all([
				supabase.from("participate_why_bullets").select("*").order("order", { ascending: true }),
				supabase.from("participate_why_paragraphs").select("*").order("order", { ascending: true }),
				supabase.from("participate_benefits").select("*").order("order", { ascending: true }),
				supabase.from("participate_complementary").select("*").order("order", { ascending: true }),
				supabase.from("participate_carousel_images").select("url").order("order", { ascending: true }),
			]);
			if (!mounted) return;
			const bulletsData = (bRes.data || []) as WhyBullet[];
			const parasData = (pRes.data || []) as WhyParagraph[];
			const benefitsData = (bnRes.data || []) as Benefit[];
			const compData = (cRes.data || []) as Complimentary[];
			const imagesData = (imgRes.data || []).map((img: any) => img.url) as string[];
			
			setBullets(bulletsData.length ? bulletsData : [
				{ id: 1 as any, text: "Massive footfall and buyer traffic", visible: true, order: 0 },
				{ id: 2 as any, text: "Mentorship and investor exposure", visible: true, order: 1 },
			]);
			setParas(parasData.length ? parasData : [
				{ id: 1 as any, text: "Showcase your brand to a high-intent audience and grow faster.", visible: true, order: 0 },
			]);
			setBenefits(benefitsData.length ? benefitsData : [
				{ id: 1 as any, title: "Brand Visibility", description: "Prominent presence among thousands of attendees.", visible: true, order: 0 },
				{ id: 2 as any, title: "Networking", description: "Connect with investors, mentors, and peers.", visible: true, order: 1 },
			]);
			setComplimentaries(compData.length ? compData : [
				{ id: 1 as any, title: "Basic stall setup", visible: true, order: 0 },
				{ id: 2 as any, title: "Festival badges", visible: true, order: 1 },
			]);
			// Set carousel images - use placeholder images if none in database
			setCarouselImages(imagesData.length > 0 ? imagesData : [
				"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
			]);
		};
		load();
		return () => { mounted = false; };
	}, []);

	const visible = <T extends { visible?: boolean | null }>(arr: T[]) => arr.filter((x) => x.visible !== false);

	return (
		<>
			<Head>
				<title>Participate as Business – Founders Fest</title>
				<meta name="description" content="Why participate as a business, benefits, and complimentary offerings at Founders Fest." />
			</Head>
			<Navbar variant="floating" />
			<main className="pt-20 md:pt-28">
				{/* WHY US */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl md:text-5xl font-bold text-primary-yellow mb-6"
						>
							Why Participate as a Business?
						</motion.h1>
						<div className="space-y-4 mb-8">
							{visible(paras).map((p) => (
								<motion.p
									key={p.id}
									initial={{ opacity: 0, y: 12 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5 }}
									className="text-lg text-white/85"
								>
									{p.text}
								</motion.p>
							))}
						</div>
						<ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{visible(bullets).map((b, idx) => (
								<motion.li
									key={b.id}
									initial={{ opacity: 0, y: 12 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: idx * 0.05 }}
									className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-4"
								>
									{b.icon ? <img src={b.icon} alt="" className="w-6 h-6 mt-1" /> : <span className="text-primary-yellow mt-1">•</span>}
									<span className="text-white/90">{b.text}</span>
								</motion.li>
							))}
						</ul>
					</div>
				</section>

				{/* BENEFITS */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl md:text-4xl font-bold text-primary-yellow mb-8"
						>
							Benefits
						</motion.h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{visible(benefits).map((bn, idx) => (
								<motion.div
									key={bn.id}
									initial={{ opacity: 0, y: 16 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: idx * 0.05 }}
									className="rounded-xl bg-white/5 border border-white/10 p-5"
								>
									<div className="flex items-center gap-3 mb-2">
										{bn.icon && <img src={bn.icon} alt="" className="w-8 h-8" />}
										<h3 className="text-xl font-semibold text-white">{bn.title}</h3>
									</div>
									<p className="text-white/80">{bn.description}</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* COMPLEMENTARY */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl md:text-4xl font-bold text-primary-yellow mb-8"
						>
							Complementary
						</motion.h2>
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{visible(complimentaries).map((c, idx) => (
								<motion.li
									key={c.id}
									initial={{ opacity: 0, y: 12 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: idx * 0.05 }}
									className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-4"
								>
									{c.icon ? <img src={c.icon} alt="" className="w-6 h-6" /> : <span className="text-primary-yellow">✓</span>}
									<span className="text-white/90">{c.title}</span>
								</motion.li>
							))}
						</ul>
					</div>
				</section>

				{/* CAROUSEL AND CTA SECTION */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="space-y-8"
						>
							{/* Image Carousel */}
							{carouselImages.length > 0 && (
								<div className="mb-8">
									<ImageCarousel images={carouselImages} autoScrollInterval={3000} />
								</div>
							)}

							{/* CTA Button */}
							<div className="text-center">
								<Link
									href="/book-stall"
									className="inline-block bg-primary-yellow text-primary-black px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-2xl uppercase tracking-wider shadow-lg hover:shadow-primary-yellow/50 hover:bg-primary-yellow/90 transition-all duration-300 font-gta"
								>
									Book a Stall
								</Link>
							</div>
						</motion.div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}


