import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Instagram, Linkedin } from "lucide-react";

type ContactInfo = { key: string; value: string };

export default function ContactPage() {
	const [info, setInfo] = useState<Record<string, string>>({});
	const [name, setName] = useState("");
	const [whatsapp, setWhatsapp] = useState("");
	const [query, setQuery] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const { data } = await supabase.from("contact_info").select("*");
			if (!mounted) return;
			const mapped = (data || []).reduce((acc: any, row: any) => {
				acc[row.key] = row.value;
				return acc;
			}, {});
			if (Object.keys(mapped).length === 0) {
				setInfo({
					phone1: "+91 63098 06633",
					//phone2: "+91 80000 00000",
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
				<section className="px-4 py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
						<div>
							<motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-3xl md:text-4xl font-bold text-primary-yellow mb-6">Contact Us</motion.h2>
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
							{(info.instagram || info.linkedin) && (
								<div className="mt-2">
									<h4 className="text-sm font-semibold text-white/80 mb-2">Social</h4>
									<div className="flex items-center gap-3">
										{info.instagram && (
											<a
												href="https://www.instagram.com/founders.fest?igsh=NjZjZDhrbDE1M2Nt"
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-pink-500/80 text-white transition-colors"
												aria-label="Instagram"
											>
												<Instagram className="h-5 w-5" />
											</a>
										)}
										{info.linkedin && (
											<a
												href="https://www.linkedin.com/company/edventure-park/"
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-sky-500/80 text-white transition-colors"
												aria-label="LinkedIn"
											>
												<Linkedin className="h-5 w-5" />
											</a>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}


