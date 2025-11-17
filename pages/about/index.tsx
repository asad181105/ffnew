import { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Metric = { id?: string; title: string; value: string; visible?: boolean; order?: number }
type ImageItem = { id?: string; url: string; alt?: string; visible?: boolean; order?: number }
type AboutSection = {
	year: number
	metrics: Metric[]
	images: ImageItem[]
	rotation_enabled: boolean
	rotation_speed: number
	hover_zoom_enabled: boolean
	section_enabled?: boolean
}

const circlePositions = (count: number, radius: number) => {
	const angleStep = (2 * Math.PI) / Math.max(count, 1)
	return new Array(Math.max(count, 1)).fill(0).map((_, i) => {
		const angle = i * angleStep
		return {
			left: `${50 + radius * Math.cos(angle)}%`,
			top: `${50 + radius * Math.sin(angle)}%`,
		}
	})
}

const RotatingWheel = ({
	images,
	rotationEnabled,
	speed,
	hoverZoom,
}: {
	images: ImageItem[]
	rotationEnabled: boolean
	speed: number
	hoverZoom: boolean
}) => {
	const visible = (images || []).filter((i) => i.visible !== false)
	const radius = 35 // percent
	const positions = useMemo(() => circlePositions(visible.length, radius), [visible.length])
	const duration = Math.max(6, speed || 12)
	return (
		<div className="relative w-full aspect-square max-w-[520px] mx-auto">
			<div
				className="absolute inset-0 rounded-full"
				style={rotationEnabled ? { animation: `ff-rotate ${duration}s linear infinite` } : {}}
			>
				{visible.map((img, idx) => (
					<div
						key={idx}
						className="absolute -translate-x-1/2 -translate-y-1/2"
						style={{ left: positions[idx]?.left, top: positions[idx]?.top }}
					>
						<div
							className={`w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg ring-2 ring-yellow-300/60 ${hoverZoom ? 'transition-transform duration-300 hover:scale-110' : ''}`}
						>
							<img src={img.url} alt={img.alt || 'Gallery image'} className="w-full h-full object-cover" />
						</div>
					</div>
				))}
			</div>
			<style jsx>{`
				@keyframes ff-rotate {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	)
}

const MetricsGrid = ({ metrics }: { metrics: Metric[] }) => {
	const items = (metrics || [])
		.filter((m) => m.visible !== false)
		.sort((a, b) => (a.order || 0) - (b.order || 0))
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
			{items.map((m, idx) => (
				<motion.div
					key={`${m.title}-${idx}`}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: idx * 0.05 }}
					className="rounded-xl bg-white/5 border border-white/10 p-5 text-center shadow-md"
				>
					<div className="text-sm tracking-wide text-white/70 font-['BlackMango',_ui-serif]">{m.title}</div>
					<div className="mt-1 text-2xl md:text-3xl font-semibold font-['Montserrat',_ui-sans-serif] text-primary-yellow">{m.value}</div>
				</motion.div>
			))}
		</div>
	)
}

const fetchAboutSections = async (): Promise<Record<number, AboutSection>> => {
	const { data } = await supabase
		.from('about_sections')
		.select('year, metrics, images, rotation_enabled, rotation_speed, hover_zoom_enabled, section_enabled')
	return (data || []).reduce((acc: Record<number, AboutSection>, row: any) => {
		acc[row.year] = {
			year: row.year,
			metrics: row.metrics || [],
			images: row.images || [],
			rotation_enabled: Boolean(row.rotation_enabled),
			rotation_speed: Number(row.rotation_speed || 12),
			hover_zoom_enabled: Boolean(row.hover_zoom_enabled),
			section_enabled: row.section_enabled !== false,
		}
		return acc
	}, {} as Record<number, AboutSection>)
}

const About: NextPage = () => {
	const [sections, setSections] = useState<Record<number, AboutSection>>({})

	useEffect(() => {
		let mounted = true
		const load = async () => {
			const s = await fetchAboutSections()
			if (mounted) setSections(s)
		}
		load()
		return () => { mounted = false }
	}, [])

	const sec2023 = sections[2023]
	const sec2024 = sections[2024]

	return (
		<>
			<Head>
				<title>About – Founders Fest</title>
				<meta name="description" content="About Founders Fest: impact metrics, galleries, and our journey." />
				<meta name="keywords" content="Founders Fest, about, startup festival, entrepreneurship, Hyderabad" />
				<meta property="og:title" content="About – Founders Fest" />
				<meta property="og:description" content="Explore the impact of Founders Fest with metrics and rotating galleries." />
				<meta property="og:type" content="website" />
			</Head>
			<Navbar variant="floating" />
			<main className="pt-20 md:pt-28">
				<section className="py-16 md:py-24 px-4 bg-gradient-to-b from-primary-black to-primary-black/95">
					<div className="container mx-auto text-center max-w-4xl">
						<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
							<h1 className="text-4xl md:text-6xl font-bold text-primary-yellow mb-6">About Founders Fest</h1>
							<p className="text-lg md:text-2xl text-primary-white/85 font-gta leading-relaxed">
								Celebrating ideas, resilience, and community.
							</p>
						</motion.div>
					</div>
				</section>

				{sec2023?.section_enabled !== false && (
					<section className="py-16 md:py-24 px-4 bg-gradient-to-b from-black to-black/95">
						<div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
							<div className="order-2 md:order-1">
								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6"
								>
									Founders Fest 2023 – Impact
								</motion.h2>
								<MetricsGrid metrics={sec2023?.metrics || []} />
							</div>
							<div className="order-1 md:order-2">
								<RotatingWheel
									images={(sec2023?.images || []).sort((a, b) => (a.order || 0) - (b.order || 0))}
									rotationEnabled={!!sec2023?.rotation_enabled}
									speed={sec2023?.rotation_speed || 12}
									hoverZoom={!!sec2023?.hover_zoom_enabled}
								/>
							</div>
						</div>
					</section>
				)}

				{sec2024?.section_enabled !== false && (
					<section className="py-16 md:py-24 px-4 bg-gradient-to-b from-black to-black/95">
						<div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
							<div className="order-2 md:order-2">
								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6"
								>
									Founders Fest 2024 – Impact
								</motion.h2>
								<MetricsGrid metrics={sec2024?.metrics || []} />
							</div>
							<div className="order-1 md:order-1">
								<RotatingWheel
									images={(sec2024?.images || []).sort((a, b) => (a.order || 0) - (b.order || 0))}
									rotationEnabled={!!sec2024?.rotation_enabled}
									speed={sec2024?.rotation_speed || 12}
									hoverZoom={!!sec2024?.hover_zoom_enabled}
								/>
							</div>
						</div>
					</section>
				)}

				{/* Team Section */}
				<TeamSection />
			</main>
			<Footer />
		</>
	)
}

type Member = { id: number; name: string; designation: string; responsibility?: string | null; image?: string | null; social_url?: string | null; visible?: boolean | null; order?: number | null };

const TeamSection = () => {
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
		<section className="py-16 md:py-24 px-4 bg-gradient-to-b from-black to-black/95">
			<div className="container mx-auto max-w-7xl">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-3xl md:text-5xl font-bold text-primary-yellow mb-10 text-center"
				>
					Meet the Team
				</motion.h2>
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
	);
}

export default About
