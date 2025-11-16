import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Nomination = {
	name: string;
	founder: string;
	whatsapp: string;
	email: string;
	website: string;
	category: string;
	about: string;
	unique: string;
	milestones: string;
	challenges: string;
	why: string;
	logo_url?: string;
	founder_image_url?: string;
	product_image_url?: string;
	video_url?: string;
	payment_number?: string;
	payment_screenshot_url?: string;
};

export default function NominatePage() {
	const [form, setForm] = useState<Nomination>({
		name: "", founder: "", whatsapp: "", email: "", website: "", category: "",
		about: "", unique: "", milestones: "", challenges: "", why: "", payment_number: ""
	});
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSuccess(null);
		setError(null);
		try {
			const { error: insertError } = await supabase.from("award_nominations").insert([{ ...form, status: "pending" }]);
			if (insertError) throw insertError;
			setSuccess("Nomination submitted successfully. We’ll review and get back to you.");
			setForm({ name: "", founder: "", whatsapp: "", email: "", website: "", category: "", about: "", unique: "", milestones: "", challenges: "", why: "", payment_number: "" });
		} catch (err: any) {
			setError(err?.message || "Failed to submit nomination");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Head><title>Nominate – Founders Fest Awards</title></Head>
			<Navbar />
			<main className="pt-20">
				<section className="px-4 py-12 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10">
						<div className="hidden lg:block rounded-xl bg-white/5 border border-white/10 p-6">
							<h1 className="text-2xl font-bold text-primary-yellow mb-4">Nominate Your Startup/Business</h1>
							<p className="text-white/80">Fill the form to nominate. Fee ₹1500. Add payment number and a screenshot URL.</p>
						</div>
						<div className="bg-white/5 border border-white/10 rounded-xl p-6">
							<form onSubmit={handleSubmit} className="space-y-4">
								<input name="name" value={form.name} onChange={handleChange} required placeholder="Startup/Business/Individual Name" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<input name="founder" value={form.founder} onChange={handleChange} required placeholder="Founder/Owner Name" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<input name="whatsapp" value={form.whatsapp} onChange={handleChange} required placeholder="WhatsApp" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
									<input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<input name="website" value={form.website} onChange={handleChange} placeholder="Website/Social" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
									<input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								</div>
								<textarea name="about" value={form.about} onChange={handleChange} placeholder="About the startup" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								<textarea name="unique" value={form.unique} onChange={handleChange} placeholder="What makes them unique" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								<textarea name="milestones" value={form.milestones} onChange={handleChange} placeholder="Milestones" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								<textarea name="challenges" value={form.challenges} onChange={handleChange} placeholder="Challenges" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								<textarea name="why" value={form.why} onChange={handleChange} placeholder="Why they deserve the award" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<input name="logo_url" value={form.logo_url || ""} onChange={handleChange} placeholder="Logo image URL" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
									<input name="founder_image_url" value={form.founder_image_url || ""} onChange={handleChange} placeholder="Founder image URL" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input name="product_image_url" value={form.product_image_url || ""} onChange={handleChange} placeholder="Product image URL" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
                                    <input name="video_url" value={form.video_url || ""} onChange={handleChange} placeholder="Video URL (30–60s)" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								</div>
								<input name="payment_number" value={form.payment_number || ""} onChange={handleChange} placeholder="Payment number" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<input name="payment_screenshot_url" value={form.payment_screenshot_url || ""} onChange={handleChange} placeholder="Payment screenshot URL" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<button type="submit" disabled={submitting} className="w-full bg-primary-yellow text-black font-semibold px-4 py-3 rounded-md">{submitting ? "Submitting..." : "Submit Nomination"}</button>
							</form>
							{success && <p className="mt-4 text-green-400">{success}</p>}
							{error && <p className="mt-4 text-red-400">{error}</p>}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}


