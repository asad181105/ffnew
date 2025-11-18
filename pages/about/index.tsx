import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CardStack3D } from '@/components/ui/3d-flip-card'
import { Carousel, TestimonialCard } from '@/components/ui/retro-testimonial'
import type { iTestimonial } from '@/components/ui/retro-testimonial'

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

type AboutPageSection = { key: string; value: string }
type AboutPageImage = { id: number; section_key: string; url: string; alt?: string | null; order?: number | null; visible?: boolean | null }
type EdVentureMetric = { id: number; icon?: string | null; value: string; label: string; order?: number | null; visible?: boolean | null }
type Testimonial = { id: number; quote: string; author_name: string; author_title: string; author_image_url?: string | null; gradient_color?: string | null; order?: number | null; visible?: boolean | null }
type ImpactStat = { id: number; value: string; label: string; order?: number | null; visible?: boolean | null }

const About: NextPage = () => {
	const [sections, setSections] = useState<Record<number, AboutSection>>({})
	const [pageSections, setPageSections] = useState<Record<string, string>>({})
	const [simpleIdeaImages, setSimpleIdeaImages] = useState<AboutPageImage[]>([])
	const [edventureMetrics, setEdventureMetrics] = useState<EdVentureMetric[]>([])
	const [testimonials, setTestimonials] = useState<Testimonial[]>([])
	const [impactStats, setImpactStats] = useState<ImpactStat[]>([])

	useEffect(() => {
		let mounted = true
		const load = async () => {
			const [sectionsData, pageSectionsData, imagesData, metricsData, testimonialsData, statsData] = await Promise.all([
				fetchAboutSections(),
				supabase.from('about_page_sections').select('*'),
				supabase.from('about_page_images').select('*').eq('section_key', 'simple_idea').order('order', { ascending: true }),
				supabase.from('edventure_park_metrics').select('*').order('order', { ascending: true }),
				supabase.from('about_testimonials').select('*').order('order', { ascending: true }),
				supabase.from('about_impact_stats').select('*').order('order', { ascending: true }),
			])
			if (!mounted) return
			setSections(sectionsData)
			const mapped = (pageSectionsData.data || []).reduce((acc: any, row: any) => {
				acc[row.key] = row.value
				return acc
			}, {})
			setPageSections(mapped)
			setSimpleIdeaImages((imagesData.data || []) as AboutPageImage[])
			setEdventureMetrics((metricsData.data || []) as EdVentureMetric[])
			setTestimonials((testimonialsData.data || []) as Testimonial[])
			setImpactStats((statsData.data || []) as ImpactStat[])
		}
		load()
		return () => { mounted = false }
	}, [])

	const sec2023 = sections[2023]
	const sec2024 = sections[2024]
	const visibleImages = simpleIdeaImages.filter((img) => img.visible !== false)
	const visibleMetrics = edventureMetrics.filter((m) => m.visible !== false)
	const visibleTestimonials = testimonials.filter((t) => t.visible !== false)
	const visibleStats = impactStats.filter((s) => s.visible !== false)

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
				{/* Why We Do This Section */}
				<section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-5xl">
            <motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center"
						>
							<h2 className="text-2xl md:text-3xl font-bold text-primary-yellow mb-4">
								{pageSections.why_we_do_this_title || 'Why We Do This'}
							</h2>
							<p className="text-base md:text-lg text-white/80 leading-relaxed max-w-4xl mx-auto mb-8">
								{pageSections.why_we_do_this_content || 'We believe that the person standing next to you at a coffee stall might just be your future co-founder. We believe that one conversation can unlock the door you\'ve been banging on for months.'}
              </p>
            </motion.div>
          </div>
        </section>

				{/* The Proof is in the People Section */}
				<section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-2xl md:text-3xl font-bold text-primary-yellow mb-6 text-center"
						>
							{pageSections.proof_title || 'The Proof is in the People (2023 & 2024)'}
						</motion.h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
							{visibleStats.map((stat, idx) => (
            <motion.div
									key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
									transition={{ duration: 0.6, delay: idx * 0.1 }}
									className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
            >
									<div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</div>
									<div className="text-sm md:text-base text-white/70">{stat.label}</div>
            </motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Join Us for the Next Chapter Section */}
				<section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
							transition={{ duration: 0.6 }}
            >
							<h2 className="text-2xl md:text-3xl font-bold text-primary-yellow mb-4">
								{pageSections.join_next_chapter_title || 'Join Us for the Next Chapter'}
              </h2>
							<div className="space-y-2 mb-6">
								<p className="text-base md:text-lg text-white">
									<strong className="text-primary-yellow">Date:</strong> {pageSections.join_next_chapter_date || 'Dec 31st, 2025 & Jan 1st, 2026'}
								</p>
								<p className="text-base md:text-lg text-white">
									<strong className="text-primary-yellow">Venue:</strong> {pageSections.join_next_chapter_venue || 'Public Gardens, Nampally, Hyderabad.'}
								</p>
              </div>
							<p className="text-base md:text-lg text-white/80 mb-6">
								{pageSections.join_next_chapter_content || 'Don\'t just watch Hyderabad grow. Be the reason it grows.'}
							</p>
            </motion.div>
					</div>
				</section>

				{/* What Actually Happens at Founders' Fest Section */}
				<section className="px-4 py-8 md:py-12 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-2xl md:text-3xl font-bold text-primary-yellow mb-6 text-center"
						>
							{pageSections.what_happens_title || 'What Actually Happens at Founders\' Fest?'}
						</motion.h2>

						{/* The Main Festival */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="mb-8"
						>
							<h3 className="text-xl md:text-2xl font-bold text-white mb-3">
								{pageSections.main_festival_title || 'The Main Festival (Dec 31, 2025 - Jan 1, 2026)'}
							</h3>
							<p className="text-base md:text-lg text-white/80 mb-6">
								{pageSections.main_festival_intro || 'We are taking over at the end of the year. Why? Because what better way to ring in a new year than by betting on yourself?'}
							</p>

							<div className="space-y-4">
								<div className="bg-white/5 border border-white/10 rounded-xl p-5">
									<h4 className="text-lg md:text-xl font-semibold text-primary-yellow mb-2">
										{pageSections.the_market_title || 'The Market'}
									</h4>
									<p className="text-base text-white/80">
										{pageSections.the_market_content || 'Walk through hundreds of stalls where founders are showcasing everything from tech solutions to handmade goods.'}
									</p>
								</div>

								<div className="bg-white/5 border border-white/10 rounded-xl p-5">
									<h4 className="text-lg md:text-xl font-semibold text-primary-yellow mb-2">
										{pageSections.the_stage_title || 'The Stage'}
									</h4>
									<p className="text-base text-white/80">
										{pageSections.the_stage_content || 'Honest conversations. We ask our speakers to leave the "success porn" at home and talk about the failures, the pivots, and the real strategies that worked.'}
									</p>
								</div>

								<div className="bg-white/5 border border-white/10 rounded-xl p-5">
									<h4 className="text-lg md:text-xl font-semibold text-primary-yellow mb-2">
										{pageSections.mentors_lounge_title || 'The Mentors\' Lounge'}
									</h4>
									<p className="text-base text-white/80">
										{pageSections.mentors_lounge_content || 'This is where the magic happens. Sit down with veterans who have been there, done that, and get honest feedback on your roadmap.'}
									</p>
								</div>
              </div>
            </motion.div>

						{/* Looking Back */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
						>
							<h3 className="text-xl md:text-2xl font-bold text-primary-yellow mb-3">
								{pageSections.looking_back_title || 'Looking Back (2023 & 2024)'}
							</h3>
							<p className="text-base md:text-lg text-white/80 leading-relaxed">
								{pageSections.looking_back_content || 'If you missed the last two years, you missed a vibe. We had over 100 influencers amplifying local brands. We had 11 startups walk away with awards that put them on the map. But mostly, we had 50,000 people realizing that entrepreneurship doesn\'t have to be a solo sport.'}
							</p>
            </motion.div>

						{/* Participate CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="text-center"
						>
							<Link href="/participate">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="inline-block bg-primary-yellow text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-primary-yellow/90 transition-colors cursor-pointer"
								>
									{pageSections.participate_cta_text || 'Participate Now'}
								</motion.div>
							</Link>
							{pageSections.participate_cta_note && (
								<p className="text-sm md:text-base text-white/70 mt-3">
									{pageSections.participate_cta_note}
								</p>
							)}
						</motion.div>
              </div>
				</section>

				{sec2023?.section_enabled !== false && (
					<section className="py-8 md:py-12 px-4 bg-gradient-to-b from-black to-black/95">
						<div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
							<div className="order-2 md:order-1">
								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-2xl md:text-3xl font-bold text-primary-yellow mb-4"
								>
									Founders Fest 2023 – Impact
								</motion.h2>
								<MetricsGrid metrics={sec2023?.metrics || []} />
							</div>
							<div className="order-1 md:order-2">
								<CardStack3D
									images={(sec2023?.images || [])
										.filter((i) => i.visible !== false)
										.sort((a, b) => (a.order || 0) - (b.order || 0))
										.map((img) => ({
											src: img.url,
											alt: img.alt || 'Founders Fest 2023',
										}))}
									cardWidth={320}
									cardHeight={400}
									spacing={{ x: 50, y: 50 }}
								/>
							</div>
						</div>
					</section>
				)}

				{sec2024?.section_enabled !== false && (
					<section className="py-8 md:py-12 px-4 bg-gradient-to-b from-black to-black/95">
						<div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
							<div className="order-2 md:order-2">
								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-2xl md:text-3xl font-bold text-primary-yellow mb-4"
								>
									Founders Fest 2024 – Impact
								</motion.h2>
								<MetricsGrid metrics={sec2024?.metrics || []} />
							</div>
							<div className="order-1 md:order-1">
								<CardStack3D
									images={(sec2024?.images || [])
										.filter((i) => i.visible !== false)
										.sort((a, b) => (a.order || 0) - (b.order || 0))
										.map((img) => ({
											src: img.url,
											alt: img.alt || 'Founders Fest 2024',
										}))}
									cardWidth={320}
									cardHeight={400}
									spacing={{ x: 50, y: 50 }}
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

	// Convert team members to testimonials format
	const testimonials: iTestimonial[] = visible.map((m) => ({
		name: m.name,
		designation: m.designation,
		description: m.responsibility || `Meet ${m.name}, our ${m.designation} who brings passion and expertise to the Founders Fest team.`,
		profileImage: m.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	}));

	const backgroundImages = [
		"https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	];

	const cards = testimonials.map((testimonial, index) => (
		<TestimonialCard
			key={`team-${index}`}
			testimonial={testimonial}
			index={index}
			backgroundImage={backgroundImages[index % backgroundImages.length]}
		/>
	));

	return (
		<section className="py-8 md:py-12 px-4 bg-gradient-to-b from-black to-black/95">
			<div className="container mx-auto max-w-7xl">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-2xl md:text-3xl font-bold text-primary-yellow mb-6 text-center"
				>
					Meet the Team
				</motion.h2>
				{testimonials.length > 0 ? (
					<Carousel items={cards} />
				) : (
					<div className="text-center text-white/60 py-12">No team members available.</div>
				)}
			</div>
		</section>
	);
}

export default About
