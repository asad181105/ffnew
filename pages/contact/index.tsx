import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Instagram, Linkedin, Twitter } from "lucide-react";

type ContactInfo = { key: string; value: string };

export default function ContactPage() {
	const [info, setInfo] = useState<Record<string, string>>({});
	const [pageContent, setPageContent] = useState<Record<string, string>>({});
	const [name, setName] = useState("");
	const [whatsapp, setWhatsapp] = useState("");
	const [query, setQuery] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const [infoRes, contentRes] = await Promise.all([
				supabase.from("contact_info").select("*"),
				supabase.from("contact_page_content").select("*"),
			]);
			if (!mounted) return;
			const mapped = (infoRes.data || []).reduce((acc: any, row: any) => {
				acc[row.key] = row.value;
				return acc;
			}, {});
			if (Object.keys(mapped).length === 0) {
				setInfo({
					phone1: "+91 63098 06633",
					email: "ceo@edventurepark.com",
					address: "Public Gardens, Hyderabad",
					venue: "Central Lawn, Public Gardens",
					datetime: "31 Dec 2025 & 1 Jan 2026",
					instagram: "https://instagram.com/foundersfest",
					linkedin: "https://linkedin.com/company/foundersfest",
				});
			} else {
				setInfo(mapped);
			}
			const contentMapped = (contentRes.data || []).reduce((acc: any, row: any) => {
				acc[row.key] = row.value;
				return acc;
			}, {});
			if (Object.keys(contentMapped).length === 0) {
				setPageContent({
					section_title: "We Actually Read Our Emails.",
					section_subtitle: "Got a question, a brilliant idea, or just want to say hi? You're in the right place.",
					email_general: "yo@foundersfest.com",
					email_partnerships: "partners@foundersfest.com",
					email_academic: "uni@foundersfest.com",
					email_stalls: "stalls@foundersfest.com",
					social_instagram: "https://instagram.com/foundersfest",
					social_twitter: "https://twitter.com/foundersfest",
					social_linkedin: "https://linkedin.com/company/foundersfest",
					team_note: "We're a small, passionate crew. We'll get back to you as soon as we can, usually within 48 funky hours. Thanks for your patience!",
				});
			} else {
				setPageContent(contentMapped);
			}
		};
		load();
		return () => { mounted = false; };
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setMessage(null);
		try {
			const { error } = await supabase.from("contact_queries").insert([{ name, whatsapp, query }]);
			if (error) throw error;
			setMessage("Thanks! We’ve received your query.");
			setName(""); setWhatsapp(""); setQuery("");
		} catch (e: any) {
			setMessage(e?.message || "Failed to send.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Head><title>Contact – Founders Fest</title></Head>
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
							className="text-3xl md:text-5xl font-bold text-primary-yellow mb-4"
						>
							{pageContent.section_title || "We Actually Read Our Emails."}
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-lg md:text-xl text-white/80 mb-12"
						>
							{pageContent.section_subtitle || "Got a question, a brilliant idea, or just want to say hi? You're in the right place."}
						</motion.p>
					</div>
				</section>

				{/* Reach Out Section */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-2xl md:text-3xl font-bold text-primary-yellow mb-8"
						>
							Reach Out
						</motion.h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5 }}
								className="bg-white/5 border border-white/10 rounded-xl p-6"
							>
								<h3 className="text-lg font-semibold text-white mb-2">General Stuff</h3>
								<a href={`mailto:${pageContent.email_general || "yo@foundersfest.com"}`} className="text-primary-yellow hover:underline">
									{pageContent.email_general || "yo@foundersfest.com"}
								</a>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.1 }}
								className="bg-white/5 border border-white/10 rounded-xl p-6"
							>
								<h3 className="text-lg font-semibold text-white mb-2">Partnerships</h3>
								<a href={`mailto:${pageContent.email_partnerships || "partners@foundersfest.com"}`} className="text-primary-yellow hover:underline">
									{pageContent.email_partnerships || "partners@foundersfest.com"}
								</a>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="bg-white/5 border border-white/10 rounded-xl p-6"
							>
								<h3 className="text-lg font-semibold text-white mb-2">Academic Partnerships</h3>
								<a href={`mailto:${pageContent.email_academic || "uni@foundersfest.com"}`} className="text-primary-yellow hover:underline">
									{pageContent.email_academic || "uni@foundersfest.com"}
								</a>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="bg-white/5 border border-white/10 rounded-xl p-6"
							>
								<h3 className="text-lg font-semibold text-white mb-2">Stall Bookings</h3>
								<a href={`mailto:${pageContent.email_stalls || "stalls@foundersfest.com"}`} className="text-primary-yellow hover:underline">
									{pageContent.email_stalls || "stalls@foundersfest.com"}
								</a>
							</motion.div>
						</div>
					</div>
				</section>

				{/* Stalk Us Section */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-2xl md:text-3xl font-bold text-primary-yellow mb-4"
						>
							Stalk Us (Socially)
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-white/80 mb-6"
						>
							Follow the journey, catch updates, and see behind the scenes.
						</motion.p>
						<div className="flex items-center gap-4">
							{pageContent.social_instagram && (
								<a
									href={pageContent.social_instagram}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-pink-500/80 text-white transition-colors"
									aria-label="Instagram"
								>
									<Instagram className="h-6 w-6" />
								</a>
							)}
							{pageContent.social_twitter && (
								<a
									href={pageContent.social_twitter}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-sky-500/80 text-white transition-colors"
									aria-label="Twitter"
								>
									<Twitter className="h-6 w-6" />
								</a>
							)}
							{pageContent.social_linkedin && (
								<a
									href={pageContent.social_linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/10 hover:bg-blue-600/80 text-white transition-colors"
									aria-label="LinkedIn"
								>
									<Linkedin className="h-6 w-6" />
								</a>
							)}
						</div>
					</div>
				</section>

				{/* Contact Form Section */}
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
						<div>
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6"
							>
								Contact Us
							</motion.h2>
							<form onSubmit={handleSubmit} className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
								<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required placeholder="WhatsApp" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<textarea value={query} onChange={(e) => setQuery(e.target.value)} required placeholder="Query" rows={4} className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<button type="submit" disabled={submitting} className="w-full bg-primary-yellow text-black font-semibold px-4 py-3 rounded-full">{submitting ? "Sending..." : "Send"}</button>
								{message && <p className="text-white/80">{message}</p>}
							</form>
						</div>
						<div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
							<div>
								<h3 className="text-xl font-semibold text-white mb-2">Information</h3>
								<ul className="space-y-1 text-white/85">
									{info.phone1 && <li>Phone: {info.phone1}</li>}
									{info.phone2 && <li>Phone 2: {info.phone2}</li>}
									{info.email && <li>Email: {info.email}</li>}
									{info.address && <li>Address: {info.address}</li>}
									{info.venue && <li>Event venue: {info.venue}</li>}
									{info.datetime && <li>Day & date: {info.datetime}</li>}
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* Team Note Section */}
				{pageContent.team_note && (
					<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
						<div className="container mx-auto max-w-4xl">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 text-center"
							>
								<p className="text-lg md:text-xl text-white/90 italic">
									{pageContent.team_note}
								</p>
							</motion.div>
						</div>
					</section>
				)}
			</main>
			<Footer />
		</>
	);
}


