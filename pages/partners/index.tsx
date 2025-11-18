import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";

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

	const YearSection = ({ 
		title, 
		partners, 
		sponsors 
	}: { 
		title: string; 
		partners: Partner[]; 
		sponsors: Partner[]; 
	}) => {
		const partnerImages = visible(partners).filter(p => p.logo).map(p => p.logo!);
		const sponsorImages = visible(sponsors).filter(p => p.logo).map(p => p.logo!);

		return (
			<section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
				<div className="container mx-auto max-w-7xl">
					<motion.h2 
						initial={{ opacity: 0, y: 20 }} 
						whileInView={{ opacity: 1, y: 0 }} 
						viewport={{ once: true }} 
						transition={{ duration: 0.6 }} 
						className="text-2xl md:text-3xl font-bold text-primary-yellow mb-8 text-center"
					>
						{title}
					</motion.h2>

					{/* Partners Section - Two Opposite Moving Carousels */}
					<div className="mb-12">
						<motion.h3 
							initial={{ opacity: 0, y: 20 }} 
							whileInView={{ opacity: 1, y: 0 }} 
							viewport={{ once: true }} 
							transition={{ duration: 0.6 }} 
							className="text-xl md:text-2xl font-semibold text-white mb-6 text-center"
						>
							Partners
						</motion.h3>
						{partnerImages.length > 0 ? (
							<div className="space-y-6">
								<ImageAutoSlider
									images={partnerImages}
									direction="left"
									speed={25}
									imageSize="md"
									className="py-4"
								/>
								<ImageAutoSlider
									images={partnerImages}
									direction="right"
									speed={30}
									imageSize="md"
									className="py-4"
								/>
							</div>
						) : (
							<div className="text-center text-white/60 py-8">
								No partner images available
							</div>
						)}
					</div>

					{/* Sponsors Section - One Carousel */}
					<div>
						<motion.h3 
							initial={{ opacity: 0, y: 20 }} 
							whileInView={{ opacity: 1, y: 0 }} 
							viewport={{ once: true }} 
							transition={{ duration: 0.6 }} 
							className="text-xl md:text-2xl font-semibold text-white mb-6 text-center"
						>
							Sponsors
						</motion.h3>
						{sponsorImages.length > 0 ? (
							<ImageAutoSlider
								images={sponsorImages}
								direction="left"
								speed={25}
								imageSize="md"
								className="py-4"
							/>
						) : (
							<div className="text-center text-white/60 py-8">
								No sponsor images available
							</div>
						)}
					</div>
				</div>
			</section>
		);
	};

	return (
		<>
			<Head>
				<title>Partners – Founders Fest</title>
				<meta name="description" content="Partners, sponsors, and influencers of Founders Fest." />
			</Head>
			<Navbar variant="floating" />
			<main className="pt-20 md:pt-28">
				<YearSection 
					title="2023 Partners & Sponsors" 
					partners={gov2023} 
					sponsors={sponsors2023} 
				/>
				<YearSection 
					title="2024 Partners & Sponsors" 
					partners={gov2024} 
					sponsors={sponsors2024} 
				/>
			</main>
			<Footer />
		</>
	);
}


