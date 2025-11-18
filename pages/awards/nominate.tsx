import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X } from "lucide-react";

const categories = [
	"Best Emerging Startup",
	"Best Early-Stage Startup",
	"Impact-Driven Startup",
	"Women-led Startup of the Year",
	"Food & Beverage Brand of the Year",
	"Homegrown Brand of the Year",
	"Small Business of the Year",
	"SME Excellence Award",
	"Young Founder Award (Under 21)",
	"Customer Favourite Brand Award",
	"Innovation in Product / Tech Award",
	"Community Choice Award",
	"Founder of the Year",
];

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
	logo?: File | null;
	founder_image?: File | null;
	product_image?: File | null;
	video_url?: string;
	payment_number?: string;
	payment_screenshot?: File | null;
};

export default function NominatePage() {
	const [form, setForm] = useState<Nomination>({
		name: "", founder: "", whatsapp: "", email: "", website: "", category: "",
		about: "", unique: "", milestones: "", challenges: "", why: "", payment_number: "",
		logo: null, founder_image: null, product_image: null, payment_screenshot: null
	});
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [founderPreview, setFounderPreview] = useState<string | null>(null);
	const [productPreview, setProductPreview] = useState<string | null>(null);
	const [paymentPreview, setPaymentPreview] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "founder_image" | "product_image" | "payment_screenshot") => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type (jpg/png only)
		const validTypes = ["image/jpeg", "image/jpg", "image/png"];
		if (!validTypes.includes(file.type)) {
			setError(`${field === "logo" ? "Logo" : field === "founder_image" ? "Founder image" : field === "product_image" ? "Product image" : "Payment screenshot"} must be a JPG or PNG file`);
			return;
		}

		// Validate file size (10 MB)
		if (file.size > 10 * 1024 * 1024) {
			setError(`${field === "logo" ? "Logo" : field === "founder_image" ? "Founder image" : field === "product_image" ? "Product image" : "Payment screenshot"} file size must be less than 10 MB`);
			return;
		}

		setForm((prev) => ({ ...prev, [field]: file }));
		setError(null);

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			if (field === "logo") {
				setLogoPreview(reader.result as string);
			} else if (field === "founder_image") {
				setFounderPreview(reader.result as string);
			} else if (field === "product_image") {
				setProductPreview(reader.result as string);
			} else {
				setPaymentPreview(reader.result as string);
			}
		};
		reader.readAsDataURL(file);
	};

	const removeFile = (field: "logo" | "founder_image" | "product_image" | "payment_screenshot") => {
		setForm((prev) => ({ ...prev, [field]: null }));
		if (field === "logo") {
			setLogoPreview(null);
		} else if (field === "founder_image") {
			setFounderPreview(null);
		} else if (field === "product_image") {
			setProductPreview(null);
		} else {
			setPaymentPreview(null);
		}
	};

	const uploadFile = async (file: File, folder: string): Promise<string | null> => {
		try {
			const fileExt = file.name.split(".").pop()?.toLowerCase();
			if (!fileExt || !["jpg", "jpeg", "png"].includes(fileExt)) {
				throw new Error("Invalid file type. Only JPG and PNG are allowed.");
			}
			const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
			const filePath = `${folder}/${fileName}`;

			const { error: uploadError } = await supabase.storage.from("award-nominations").upload(filePath, file);

			if (uploadError) throw uploadError;

			const { data } = supabase.storage.from("award-nominations").getPublicUrl(filePath);
			return data.publicUrl;
		} catch (error) {
			console.error("Upload error:", error);
			return null;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSuccess(null);
		setError(null);

		try {
			// Validate required fields
			if (!form.name || !form.founder || !form.whatsapp || !form.email || !form.category || !form.about || !form.unique || !form.milestones || !form.challenges || !form.why) {
				throw new Error("Please fill all required fields");
			}

			// Validate required logo
			if (!form.logo) {
				throw new Error("Logo is required");
			}

			// Upload files
			const logoUrl = await uploadFile(form.logo, "logos");
			if (!logoUrl) throw new Error("Failed to upload logo");

			let founderImageUrl: string | null = null;
			let productImageUrl: string | null = null;
			let paymentScreenshotUrl: string | null = null;

			if (form.founder_image) {
				founderImageUrl = await uploadFile(form.founder_image, "founders");
				if (!founderImageUrl) throw new Error("Failed to upload founder image");
			}

			if (form.product_image) {
				productImageUrl = await uploadFile(form.product_image, "products");
				if (!productImageUrl) throw new Error("Failed to upload product image");
			}

			if (form.payment_screenshot) {
				paymentScreenshotUrl = await uploadFile(form.payment_screenshot, "payments");
				if (!paymentScreenshotUrl) throw new Error("Failed to upload payment screenshot");
			}

			// Insert into database
			const { error: insertError } = await supabase.from("award_nominations").insert([
				{
					name: form.name,
					founder: form.founder,
					whatsapp: form.whatsapp,
					email: form.email,
					website: form.website || null,
					category: form.category,
					about: form.about,
					unique_value: form.unique,
					milestones: form.milestones,
					challenges: form.challenges,
					why: form.why,
					logo_url: logoUrl,
					founder_image_url: founderImageUrl,
					product_image_url: productImageUrl,
					video_url: form.video_url || null,
					payment_number: form.payment_number || null,
					payment_screenshot_url: paymentScreenshotUrl,
					status: "pending",
				},
			]);

			if (insertError) throw insertError;

			setSuccess("Nomination submitted successfully. We'll review and get back to you.");
			setForm({
				name: "", founder: "", whatsapp: "", email: "", website: "", category: "",
				about: "", unique: "", milestones: "", challenges: "", why: "", payment_number: "",
				logo: null, founder_image: null, product_image: null, payment_screenshot: null
			});
			setLogoPreview(null);
			setFounderPreview(null);
			setProductPreview(null);
			setPaymentPreview(null);
		} catch (err: any) {
			setError(err?.message || "Failed to submit nomination");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Head><title>Nominate – Founders Fest Awards</title></Head>
			<Navbar variant="floating" />
			<main className="pt-20 md:pt-28">
				<section className="px-4 py-12 bg-gradient-to-b from-black to-black/95">
					<div className="container mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10">
						<div className="hidden lg:block rounded-xl bg-white/5 border border-white/10 p-6">
							<h1 className="text-2xl font-bold text-primary-yellow mb-4">Nominate Your Startup/Business</h1>
							<p className="text-white/80">Fill the form to nominate. Fee ₹1500. Upload images (JPG/PNG only) and add payment details.</p>
						</div>
						<div className="bg-white/5 border border-white/10 rounded-xl p-6">
							<form onSubmit={handleSubmit} className="space-y-4">
								<input name="name" value={form.name} onChange={handleChange} required placeholder="Startup/Business/Individual Name" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<input name="founder" value={form.founder} onChange={handleChange} required placeholder="Founder/Owner Name" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<input name="whatsapp" value={form.whatsapp} onChange={handleChange} required placeholder="WhatsApp" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
									<input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								</div>
								<input name="website" value={form.website} onChange={handleChange} placeholder="Website/Social" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<select name="category" value={form.category} onChange={handleChange} required className="w-full rounded-md bg-black/40 border border-white/10 p-3">
									<option value="">Select Category *</option>
									{categories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
								<textarea name="about" value={form.about} onChange={handleChange} placeholder="About the startup" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								<textarea name="unique" value={form.unique} onChange={handleChange} placeholder="What makes them unique" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								<textarea name="milestones" value={form.milestones} onChange={handleChange} placeholder="Milestones" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								<textarea name="challenges" value={form.challenges} onChange={handleChange} placeholder="Challenges" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								<textarea name="why" value={form.why} onChange={handleChange} placeholder="Why they deserve the award" className="w-full rounded-md bg-black/40 border border-white/10 p-3" rows={3} />
								{/* Logo Upload */}
								<div>
									<label className="block text-white/80 mb-2">Logo (JPG/PNG only, max 10MB) *</label>
									{!form.logo ? (
										<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-black/20 hover:bg-black/40 transition-colors">
											<div className="flex flex-col items-center justify-center pt-5 pb-6">
												<Upload className="w-8 h-8 mb-2 text-white/60" />
												<p className="mb-2 text-sm text-white/70">Click to upload logo</p>
												<p className="text-xs text-white/50">JPG or PNG (MAX. 10MB)</p>
											</div>
											<input type="file" className="hidden" accept="image/jpeg,image/jpg,image/png" onChange={(e) => handleFileChange(e, "logo")} />
										</label>
									) : (
										<div className="relative">
											<img src={logoPreview || ""} alt="Logo preview" className="w-full h-32 object-contain rounded-lg border border-white/10" />
											<button type="button" onClick={() => removeFile("logo")} className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700">
												<X className="w-4 h-4" />
											</button>
										</div>
									)}
								</div>

								{/* Founder Image Upload */}
								<div>
									<label className="block text-white/80 mb-2">Founder Image (JPG/PNG only, max 10MB)</label>
									{!form.founder_image ? (
										<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-black/20 hover:bg-black/40 transition-colors">
											<div className="flex flex-col items-center justify-center pt-5 pb-6">
												<Upload className="w-8 h-8 mb-2 text-white/60" />
												<p className="mb-2 text-sm text-white/70">Click to upload founder image</p>
												<p className="text-xs text-white/50">JPG or PNG (MAX. 10MB)</p>
											</div>
											<input type="file" className="hidden" accept="image/jpeg,image/jpg,image/png" onChange={(e) => handleFileChange(e, "founder_image")} />
										</label>
									) : (
										<div className="relative">
											<img src={founderPreview || ""} alt="Founder preview" className="w-full h-32 object-contain rounded-lg border border-white/10" />
											<button type="button" onClick={() => removeFile("founder_image")} className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700">
												<X className="w-4 h-4" />
											</button>
										</div>
									)}
								</div>

								{/* Product Image Upload */}
								<div>
									<label className="block text-white/80 mb-2">Product Image (JPG/PNG only, max 10MB)</label>
									{!form.product_image ? (
										<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-black/20 hover:bg-black/40 transition-colors">
											<div className="flex flex-col items-center justify-center pt-5 pb-6">
												<Upload className="w-8 h-8 mb-2 text-white/60" />
												<p className="mb-2 text-sm text-white/70">Click to upload product image</p>
												<p className="text-xs text-white/50">JPG or PNG (MAX. 10MB)</p>
											</div>
											<input type="file" className="hidden" accept="image/jpeg,image/jpg,image/png" onChange={(e) => handleFileChange(e, "product_image")} />
										</label>
									) : (
										<div className="relative">
											<img src={productPreview || ""} alt="Product preview" className="w-full h-32 object-contain rounded-lg border border-white/10" />
											<button type="button" onClick={() => removeFile("product_image")} className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700">
												<X className="w-4 h-4" />
											</button>
										</div>
									)}
								</div>

								<input name="video_url" value={form.video_url || ""} onChange={handleChange} placeholder="Video URL (30–60s)" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />
								<input name="payment_number" value={form.payment_number || ""} onChange={handleChange} placeholder="Payment number" className="w-full rounded-md bg-black/40 border border-white/10 p-3" />

								{/* Payment Screenshot Upload */}
								<div>
									<label className="block text-white/80 mb-2">Payment Screenshot (JPG/PNG only, max 10MB)</label>
									{!form.payment_screenshot ? (
										<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-black/20 hover:bg-black/40 transition-colors">
											<div className="flex flex-col items-center justify-center pt-5 pb-6">
												<Upload className="w-8 h-8 mb-2 text-white/60" />
												<p className="mb-2 text-sm text-white/70">Click to upload payment screenshot</p>
												<p className="text-xs text-white/50">JPG or PNG (MAX. 10MB)</p>
											</div>
											<input type="file" className="hidden" accept="image/jpeg,image/jpg,image/png" onChange={(e) => handleFileChange(e, "payment_screenshot")} />
										</label>
									) : (
										<div className="relative">
											<img src={paymentPreview || ""} alt="Payment preview" className="w-full h-32 object-contain rounded-lg border border-white/10" />
											<button type="button" onClick={() => removeFile("payment_screenshot")} className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700">
												<X className="w-4 h-4" />
											</button>
										</div>
									)}
								</div>
								<button type="submit" disabled={submitting} className="w-full bg-primary-yellow text-black font-semibold px-4 py-3 rounded-full">{submitting ? "Submitting..." : "Submit Nomination"}</button>
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


