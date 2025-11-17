import { useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Upload, X } from "lucide-react";

type StallForm = {
	name: string;
	startupName: string;
	logo: File | null;
	category: string;
	customCategory: string;
	businessDescription: string;
	contact: string;
	email: string;
	socialMediaHandle: string;
	stallType: string;
	paymentScreenshot: File | null;
};

const categories = [
	"Food and Beverages",
	"Fashion and Accessories",
	"Arts and Crafts",
	"Technology and Electronics",
	"Health and Wellness",
	"Home and Décor",
	"Education and Learning",
	"Entertainment and Games",
	"Artificial intelligence",
	"Other:",
];

const stallTypes = [
	"Early Bird offer (Single stall 10x10 feet) Rs. 9,000",
	"Regular offer (Single stall 10x10 feet) Rs. 12,000",
];

export default function BookStallPage() {
	const [form, setForm] = useState<StallForm>({
		name: "",
		startupName: "",
		logo: null,
		category: "",
		customCategory: "",
		businessDescription: "",
		contact: "",
		email: "",
		socialMediaHandle: "",
		stallType: "",
		paymentScreenshot: null,
	});

	const [submitting, setSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [paymentPreview, setPaymentPreview] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "paymentScreenshot") => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file size (10 MB)
		if (file.size > 10 * 1024 * 1024) {
			setErrorMessage(`${field === "logo" ? "Logo" : "Payment screenshot"} file size must be less than 10 MB`);
			return;
		}

		setForm((prev) => ({ ...prev, [field]: file }));

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			if (field === "logo") {
				setLogoPreview(reader.result as string);
			} else {
				setPaymentPreview(reader.result as string);
			}
		};
		reader.readAsDataURL(file);
	};

	const removeFile = (field: "logo" | "paymentScreenshot") => {
		setForm((prev) => ({ ...prev, [field]: null }));
		if (field === "logo") {
			setLogoPreview(null);
		} else {
			setPaymentPreview(null);
		}
	};

	const uploadFile = async (file: File, folder: string): Promise<string | null> => {
		try {
			const fileExt = file.name.split(".").pop();
			const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
			const filePath = `${folder}/${fileName}`;

			const { error: uploadError } = await supabase.storage.from("stall-bookings").upload(filePath, file);

			if (uploadError) throw uploadError;

			const { data } = supabase.storage.from("stall-bookings").getPublicUrl(filePath);
			return data.publicUrl;
		} catch (error) {
			console.error("Upload error:", error);
			return null;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSuccessMessage(null);
		setErrorMessage(null);

		try {
			// Validate required fields
			if (!form.name || !form.startupName || !form.logo || !form.category || !form.businessDescription || !form.contact || !form.email || !form.socialMediaHandle || !form.stallType || !form.paymentScreenshot) {
				throw new Error("Please fill all required fields");
			}

			// Handle custom category
			const finalCategory = form.category === "Other:" ? form.customCategory : form.category;
			if (form.category === "Other:" && !form.customCategory) {
				throw new Error("Please specify the custom category");
			}

			// Upload files
			const logoUrl = await uploadFile(form.logo!, "logos");
			const paymentUrl = await uploadFile(form.paymentScreenshot!, "payments");

			if (!logoUrl || !paymentUrl) {
				throw new Error("Failed to upload files. Please try again.");
			}

			// Insert into database
			const { error } = await supabase.from("stall_bookings").insert([
				{
					name: form.name,
					startup_name: form.startupName,
					logo_url: logoUrl,
					category: finalCategory,
					business_description: form.businessDescription,
					contact: form.contact,
					email: form.email,
					social_media_handle: form.socialMediaHandle,
					stall_type: form.stallType,
					payment_screenshot_url: paymentUrl,
					created_at: new Date().toISOString(),
				},
			]);

			if (error) throw error;

			setSuccessMessage("Stall booking submitted successfully! We'll contact you soon.");
			// Reset form
			setForm({
				name: "",
				startupName: "",
				logo: null,
				category: "",
				customCategory: "",
				businessDescription: "",
				contact: "",
				email: "",
				socialMediaHandle: "",
				stallType: "",
				paymentScreenshot: null,
			});
			setLogoPreview(null);
			setPaymentPreview(null);
		} catch (error: any) {
			setErrorMessage(error?.message || "Failed to submit. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Head>
				<title>Book a Stall – Founders Fest</title>
				<meta name="description" content="Book your stall at Founders Fest 2025-26" />
			</Head>
			<Navbar variant="floating" />
			<main className="pt-20 md:pt-28 pb-16">
				<section className="px-4 py-12 md:py-16 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-4xl">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-center mb-8 md:mb-12"
						>
							<h1 className="text-3xl md:text-5xl font-bold text-primary-yellow mb-4 font-gta">Book a Stall</h1>
							<p className="text-white/80 text-base md:text-lg">
								PS: This is an Early bird offer. From November 15th, the stall price is going to be ₹12,000/- (Single table 10x10 feet x 8 ft height)
							</p>
						</motion.div>

						<motion.form
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							onSubmit={handleSubmit}
							className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 space-y-6"
						>
							{/* Name */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									Name <span className="text-red-400">*</span>
								</label>
								<input
									type="text"
									name="name"
									value={form.name}
									onChange={handleChange}
									required
									className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-primary-yellow transition-colors"
									placeholder="Enter your name"
								/>
							</div>

							{/* Startup Name */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									Startup Name <span className="text-red-400">*</span>
								</label>
								<input
									type="text"
									name="startupName"
									value={form.startupName}
									onChange={handleChange}
									required
									className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-primary-yellow transition-colors"
									placeholder="Enter startup/business name"
								/>
							</div>

							{/* Logo Upload */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									Logo <span className="text-red-400">*</span>
								</label>
								<p className="text-white/60 text-sm mb-2">Upload 1 supported file. Max 10 MB.</p>
								{!logoPreview ? (
									<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-black/20 hover:bg-black/40 transition-colors">
										<div className="flex flex-col items-center justify-center pt-5 pb-6">
											<Upload className="w-8 h-8 mb-2 text-white/60" />
											<p className="mb-2 text-sm text-white/60">
												<span className="font-semibold">Click to upload</span> or drag and drop
											</p>
											<p className="text-xs text-white/40">PNG, JPG, GIF up to 10MB</p>
										</div>
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(e) => handleFileChange(e, "logo")}
											required
										/>
									</label>
								) : (
									<div className="relative inline-block">
										<img src={logoPreview} alt="Logo preview" className="h-32 w-auto rounded-lg border border-white/10" />
										<button
											type="button"
											onClick={() => removeFile("logo")}
											className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								)}
							</div>

							{/* Category */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									Startup/Business Category <span className="text-red-400">*</span>
								</label>
								<select
									name="category"
									value={form.category}
									onChange={handleChange}
									required
									className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-primary-yellow transition-colors"
								>
									<option value="">Select a category</option>
									{categories.map((cat) => (
										<option key={cat} value={cat} className="bg-black">
											{cat}
										</option>
									))}
								</select>
								{form.category === "Other:" && (
									<input
										type="text"
										name="customCategory"
										value={form.customCategory}
										onChange={handleChange}
										required
										placeholder="Please specify"
										className="w-full mt-3 rounded-md bg-black/40 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-primary-yellow transition-colors"
									/>
								)}
							</div>

							{/* Business Description */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									Business Description <span className="text-red-400">*</span>
								</label>
								<textarea
									name="businessDescription"
									value={form.businessDescription}
									onChange={handleChange}
									required
									rows={4}
									className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-primary-yellow transition-colors resize-none"
									placeholder="Describe your business/startup"
								/>
							</div>

							{/* Contact */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									Contact <span className="text-red-400">*</span>
								</label>
								<input
									type="tel"
									name="contact"
									value={form.contact}
									onChange={handleChange}
									required
									className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-primary-yellow transition-colors"
									placeholder="Phone number"
								/>
							</div>

							{/* Email */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									Email <span className="text-red-400">*</span>
								</label>
								<input
									type="email"
									name="email"
									value={form.email}
									onChange={handleChange}
									required
									className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-primary-yellow transition-colors"
									placeholder="your@email.com"
								/>
							</div>

							{/* Social Media Handle */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									Social Media handle (if any) Please attach the link below <span className="text-red-400">*</span>
								</label>
								<input
									type="url"
									name="socialMediaHandle"
									value={form.socialMediaHandle}
									onChange={handleChange}
									required
									className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-primary-yellow transition-colors"
									placeholder="https://instagram.com/yourhandle or https://facebook.com/yourpage"
								/>
								<p className="text-white/60 text-sm mt-1">(Please Make sure the Link (if attached) is opened for all)</p>
							</div>

							{/* Stall Type */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									What type of stall do you want to set up? <span className="text-red-400">*</span>
								</label>
								<select
									name="stallType"
									value={form.stallType}
									onChange={handleChange}
									required
									className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-primary-yellow transition-colors"
								>
									<option value="">Select stall type</option>
									{stallTypes.map((type) => (
										<option key={type} value={type} className="bg-black">
											{type}
										</option>
									))}
								</select>
							</div>

							{/* Payment Screenshot */}
							<div>
								<label className="block text-white font-semibold mb-2 font-gta">
									Please attach the screenshot of the payment below to confirm your stall booking. <span className="text-red-400">*</span>
								</label>
								<p className="text-white/60 text-sm mb-2">Upload 1 supported file: PDF, document or image. Max 10 MB.</p>
								{!paymentPreview ? (
									<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-black/20 hover:bg-black/40 transition-colors">
										<div className="flex flex-col items-center justify-center pt-5 pb-6">
											<Upload className="w-8 h-8 mb-2 text-white/60" />
											<p className="mb-2 text-sm text-white/60">
												<span className="font-semibold">Click to upload</span> or drag and drop
											</p>
											<p className="text-xs text-white/40">PDF, DOC, PNG, JPG up to 10MB</p>
										</div>
										<input
											type="file"
											accept=".pdf,.doc,.docx,image/*"
											className="hidden"
											onChange={(e) => handleFileChange(e, "paymentScreenshot")}
											required
										/>
									</label>
								) : (
									<div className="relative inline-block">
										{paymentPreview.startsWith("data:image") ? (
											<img src={paymentPreview} alt="Payment preview" className="h-32 w-auto rounded-lg border border-white/10" />
										) : (
											<div className="h-32 w-48 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center text-white/60">
												PDF Document
											</div>
										)}
										<button
											type="button"
											onClick={() => removeFile("paymentScreenshot")}
											className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								)}
							</div>

							{/* Messages */}
							{errorMessage && <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg text-sm">{errorMessage}</div>}
							{successMessage && <div className="bg-green-500/20 border border-green-500 text-green-200 p-4 rounded-lg text-sm">{successMessage}</div>}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={submitting}
								className="w-full bg-primary-yellow text-black font-bold px-6 py-4 rounded-full hover:bg-primary-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-gta text-lg"
							>
								{submitting ? "Submitting..." : "Submit Booking"}
							</button>
						</motion.form>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}

