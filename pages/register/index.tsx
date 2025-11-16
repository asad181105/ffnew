import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AttendeeForm = {
	name: string;
	whatsapp: string;
	email: string;
	city: string;
	referrer: string;
	occupation: string;
	organization: string;
};

export default function RegisterAttendeePage() {
	const [form, setForm] = useState<AttendeeForm>({
		name: "",
		whatsapp: "",
		email: "",
		city: "",
		referrer: "",
		occupation: "",
		organization: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSuccessMessage(null);
		setErrorMessage(null);

		try {
			const { error } = await supabase.from("attendees").insert([
				{
					name: form.name,
					whatsapp: form.whatsapp,
					email: form.email,
					city: form.city,
					referrer: form.referrer,
					occupation: form.occupation,
					organization: form.organization,
					status: "pending",
				},
			]);
			if (error) throw error;
			setSuccessMessage("Thank you for registering! We’ll review and notify you by email.");
			setForm({
				name: "",
				whatsapp: "",
				email: "",
				city: "",
				referrer: "",
				occupation: "",
				organization: "",
			});
		} catch (err: any) {
			setErrorMessage(err?.message || "Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-black via-black/95 to-black text-white">
			<Head>
				<title>Register Now – Founders Fest</title>
				<meta name="description" content="Register Now to attend Founders Fest. Join entrepreneurs, investors, and innovators." />
			</Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
					<div className="hidden lg:block rounded-2xl bg-gradient-to-br from-yellow-300/20 via-yellow-400/10 to-transparent p-1">
						<div className="h-full w-full rounded-2xl bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-400/20 via-yellow-300/10 to-transparent p-8 flex items-center justify-center">
							<div className="text-center">
								<img src="/hero.svg" alt="Founders Fest" className="mx-auto w-3/4 mb-6" />
								<p className="text-yellow-300/90 text-lg">Ignite. Build. Celebrate.</p>
							</div>
						</div>
					</div>
					<div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8">
						<div className="flex items-center justify-between mb-6">
							<h1 className="text-2xl sm:text-3xl font-bold text-primary-yellow">Register Now</h1>
							<Link href="/" className="text-sm text-yellow-300 hover:text-yellow-200 underline">Back to Home</Link>
						</div>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm mb-1">Name</label>
								<input
									name="name"
									value={form.name}
									onChange={handleChange}
									required
									className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
									placeholder="Your full name"
								/>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm mb-1">WhatsApp Number</label>
									<input
										name="whatsapp"
										value={form.whatsapp}
										onChange={handleChange}
										required
										className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
										placeholder="e.g., +91 9876543210"
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">Email</label>
									<input
										type="email"
										name="email"
										value={form.email}
										onChange={handleChange}
										required
										className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
										placeholder="you@example.com"
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm mb-1">City</label>
									<input
										name="city"
										value={form.city}
										onChange={handleChange}
										required
										className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
										placeholder="Your city"
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">How did you hear about us</label>
									<input
										name="referrer"
										value={form.referrer}
										onChange={handleChange}
										className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
										placeholder="Friend, Instagram, etc."
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm mb-1">Occupation</label>
									<input
										name="occupation"
										value={form.occupation}
										onChange={handleChange}
										className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
										placeholder="Student, Founder, etc."
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">College/Organisation/Startup Name</label>
									<input
										name="organization"
										value={form.organization}
										onChange={handleChange}
										className="w-full rounded-md bg-black/50 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
										placeholder="Your organisation"
									/>
								</div>
							</div>
							<button
								type="submit"
								disabled={submitting}
								className="w-full bg-primary-yellow text-primary-black px-4 py-3 rounded-md font-semibold hover:opacity-90 disabled:opacity-60"
							>
								{submitting ? "Submitting..." : "Submit Registration"}
							</button>
						</form>
						{successMessage && (
							<p className="mt-4 text-green-400">{successMessage}</p>
						)}
						{errorMessage && (
							<p className="mt-4 text-red-400">{errorMessage}</p>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}


