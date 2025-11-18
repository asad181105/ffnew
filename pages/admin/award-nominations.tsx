import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";
import { Check, X, Eye, Download } from "lucide-react";

type AwardNomination = {
	id: string;
	created_at: string;
	name: string;
	founder: string;
	whatsapp: string;
	email: string;
	website: string | null;
	category: string;
	about: string;
	unique_value: string;
	milestones: string;
	challenges: string;
	why: string;
	logo_url: string | null;
	founder_image_url: string | null;
	product_image_url: string | null;
	video_url: string | null;
	payment_number: string | null;
	payment_screenshot_url: string | null;
	status: "pending" | "approved" | "rejected";
};

export default function AdminAwardNominations() {
	const [nominations, setNominations] = useState<AwardNomination[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedNomination, setSelectedNomination] = useState<AwardNomination | null>(null);
	const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
	const [updating, setUpdating] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const { data, error } = await supabase
				.from("award_nominations")
				.select("*")
				.order("created_at", { ascending: false });
			if (!mounted) return;
			if (error) {
				console.error("Error loading nominations:", error);
			} else {
				setNominations((data as AwardNomination[]) || []);
			}
			setLoading(false);
		};
		load();
		return () => {
			mounted = false;
		};
	}, []);

	const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
		setUpdating(id);
		try {
			const { error } = await supabase
				.from("award_nominations")
				.update({ status })
				.eq("id", id);

			if (error) throw error;

			setNominations((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));
			if (selectedNomination?.id === id) {
				setSelectedNomination({ ...selectedNomination, status });
			}
		} catch (error) {
			console.error("Error updating status:", error);
			alert("Failed to update status. Please try again.");
		} finally {
			setUpdating(null);
		}
	};

	const exportToCSV = () => {
		const filtered = filter === "all" ? nominations : nominations.filter((n) => n.status === filter);
		const headers = [
			"ID",
			"Startup Name",
			"Founder",
			"Email",
			"WhatsApp",
			"Category",
			"Status",
			"Created At",
		];
		const rows = filtered.map((n) => [
			n.id,
			n.name,
			n.founder,
			n.email,
			n.whatsapp,
			n.category,
			n.status,
			new Date(n.created_at).toLocaleString(),
		]);

		const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `award-nominations-${filter}-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const filteredNominations = filter === "all" ? nominations : nominations.filter((n) => n.status === filter);

	const statusCounts = {
		all: nominations.length,
		pending: nominations.filter((n) => n.status === "pending").length,
		approved: nominations.filter((n) => n.status === "approved").length,
		rejected: nominations.filter((n) => n.status === "rejected").length,
	};

	if (loading) {
		return (
			<AdminGuard>
				<div className="min-h-screen bg-black text-white flex items-center justify-center">
					<div className="text-white/70">Loading...</div>
				</div>
			</AdminGuard>
		);
	}

	return (
		<AdminGuard>
			<div className="min-h-screen bg-black text-white">
				<Head>
					<title>Award Nominations – Admin</title>
				</Head>
				<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
					<div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<Link href="/admin" className="text-primary-yellow hover:underline mb-2 inline-block">
								← Back to Dashboard
							</Link>
							<h1 className="text-2xl md:text-3xl font-bold text-primary-yellow">Award Nominations</h1>
						</div>
						<button
							onClick={exportToCSV}
							className="flex items-center gap-2 bg-primary-yellow text-black px-4 py-2 rounded-lg font-semibold hover:bg-primary-yellow/90 transition-colors"
						>
							<Download className="w-4 h-4" />
							Export CSV
						</button>
					</div>

					{/* Filter Tabs */}
					<div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
						{(["all", "pending", "approved", "rejected"] as const).map((f) => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									filter === f
										? "bg-primary-yellow text-black"
										: "bg-white/5 text-white/70 hover:bg-white/10"
								}`}
							>
								{f.charAt(0).toUpperCase() + f.slice(1)} ({statusCounts[f]})
							</button>
						))}
					</div>

					{/* Nominations List */}
					<div className="space-y-4">
						{filteredNominations.length === 0 ? (
							<div className="text-center py-12 text-white/60">No nominations found.</div>
						) : (
							filteredNominations.map((nomination) => (
								<div
									key={nomination.id}
									className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 hover:bg-white/8 transition-colors"
								>
									<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
										<div className="flex-1">
											<div className="flex flex-wrap items-start gap-4 mb-4">
												{nomination.logo_url && (
													<img
														src={nomination.logo_url}
														alt={nomination.name}
														className="w-16 h-16 object-cover rounded-lg border border-white/10"
													/>
												)}
												<div className="flex-1 min-w-0">
													<h3 className="text-lg md:text-xl font-semibold text-white mb-1">{nomination.name}</h3>
													<p className="text-white/70 text-sm mb-2">by {nomination.founder}</p>
													<div className="flex flex-wrap gap-2 text-sm">
														<span className="px-2 py-1 bg-white/10 rounded text-white/80">{nomination.category}</span>
														<span
															className={`px-2 py-1 rounded ${
																nomination.status === "approved"
																	? "bg-green-500/20 text-green-300"
																	: nomination.status === "rejected"
																	? "bg-red-500/20 text-red-300"
																	: "bg-yellow-500/20 text-yellow-300"
															}`}
														>
															{nomination.status}
														</span>
													</div>
												</div>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/70 mb-4">
												<div>
													<span className="text-white/50">Email:</span> {nomination.email}
												</div>
												<div>
													<span className="text-white/50">WhatsApp:</span> {nomination.whatsapp}
												</div>
												{nomination.website && (
													<div className="sm:col-span-2">
														<span className="text-white/50">Website:</span>{" "}
														<a href={nomination.website} target="_blank" rel="noopener noreferrer" className="text-primary-yellow hover:underline">
															{nomination.website}
														</a>
													</div>
												)}
												<div className="sm:col-span-2 text-xs text-white/50">
													Submitted: {new Date(nomination.created_at).toLocaleString()}
												</div>
											</div>
										</div>
										<div className="flex flex-col sm:flex-row gap-2">
											<button
												onClick={() => setSelectedNomination(nomination)}
												className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
											>
												<Eye className="w-4 h-4" />
												View Details
											</button>
											{nomination.status === "pending" && (
												<>
													<button
														onClick={() => handleStatusUpdate(nomination.id, "approved")}
														disabled={updating === nomination.id}
														className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
													>
														<Check className="w-4 h-4" />
														{updating === nomination.id ? "Updating..." : "Approve"}
													</button>
													<button
														onClick={() => handleStatusUpdate(nomination.id, "rejected")}
														disabled={updating === nomination.id}
														className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
													>
														<X className="w-4 h-4" />
														{updating === nomination.id ? "Updating..." : "Reject"}
													</button>
												</>
											)}
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</main>

				{/* Detail Modal */}
				{selectedNomination && (
					<div
						className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						onClick={() => setSelectedNomination(null)}
					>
						<div
							className="bg-black border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-start justify-between mb-6">
								<h2 className="text-2xl font-bold text-primary-yellow">Nomination Details</h2>
								<button
									onClick={() => setSelectedNomination(null)}
									className="text-white/70 hover:text-white transition-colors"
								>
									<X className="w-6 h-6" />
								</button>
							</div>

							<div className="space-y-6">
								<div className="flex items-start gap-4">
									{selectedNomination.logo_url && (
										<img
											src={selectedNomination.logo_url}
											alt={selectedNomination.name}
											className="w-24 h-24 object-cover rounded-lg border border-white/10"
										/>
									)}
									<div>
										<h3 className="text-xl font-semibold text-white mb-1">{selectedNomination.name}</h3>
										<p className="text-white/70">by {selectedNomination.founder}</p>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-white/50 text-sm">Email</label>
										<p className="text-white">{selectedNomination.email}</p>
									</div>
									<div>
										<label className="text-white/50 text-sm">WhatsApp</label>
										<p className="text-white">{selectedNomination.whatsapp}</p>
									</div>
									{selectedNomination.website && (
										<div className="md:col-span-2">
											<label className="text-white/50 text-sm">Website</label>
											<p className="text-white">
												<a href={selectedNomination.website} target="_blank" rel="noopener noreferrer" className="text-primary-yellow hover:underline">
													{selectedNomination.website}
												</a>
											</p>
										</div>
									)}
									<div>
										<label className="text-white/50 text-sm">Category</label>
										<p className="text-white">{selectedNomination.category}</p>
									</div>
									<div>
										<label className="text-white/50 text-sm">Status</label>
										<p
											className={`inline-block px-3 py-1 rounded ${
												selectedNomination.status === "approved"
													? "bg-green-500/20 text-green-300"
													: selectedNomination.status === "rejected"
													? "bg-red-500/20 text-red-300"
													: "bg-yellow-500/20 text-yellow-300"
											}`}
										>
											{selectedNomination.status}
										</p>
									</div>
									<div>
										<label className="text-white/50 text-sm">Submitted</label>
										<p className="text-white">{new Date(selectedNomination.created_at).toLocaleString()}</p>
									</div>
								</div>

								<div className="md:col-span-2">
									<label className="text-white/50 text-sm">About</label>
									<p className="text-white whitespace-pre-wrap">{selectedNomination.about}</p>
								</div>

								<div className="md:col-span-2">
									<label className="text-white/50 text-sm">Unique Value</label>
									<p className="text-white whitespace-pre-wrap">{selectedNomination.unique_value}</p>
								</div>

								<div className="md:col-span-2">
									<label className="text-white/50 text-sm">Milestones</label>
									<p className="text-white whitespace-pre-wrap">{selectedNomination.milestones}</p>
								</div>

								<div className="md:col-span-2">
									<label className="text-white/50 text-sm">Challenges</label>
									<p className="text-white whitespace-pre-wrap">{selectedNomination.challenges}</p>
								</div>

								<div className="md:col-span-2">
									<label className="text-white/50 text-sm">Why This Startup Should Win</label>
									<p className="text-white whitespace-pre-wrap">{selectedNomination.why}</p>
								</div>

								{selectedNomination.founder_image_url && (
									<div>
										<label className="text-white/50 text-sm mb-2 block">Founder Image</label>
										<a
											href={selectedNomination.founder_image_url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block"
										>
											<img
												src={selectedNomination.founder_image_url}
												alt="Founder"
												className="max-w-full h-auto rounded-lg border border-white/10 max-h-96"
											/>
										</a>
									</div>
								)}

								{selectedNomination.product_image_url && (
									<div>
										<label className="text-white/50 text-sm mb-2 block">Product Image</label>
										<a
											href={selectedNomination.product_image_url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block"
										>
											<img
												src={selectedNomination.product_image_url}
												alt="Product"
												className="max-w-full h-auto rounded-lg border border-white/10 max-h-96"
											/>
										</a>
									</div>
								)}

								{selectedNomination.video_url && (
									<div>
										<label className="text-white/50 text-sm mb-2 block">Video</label>
										<a
											href={selectedNomination.video_url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary-yellow hover:underline"
										>
											{selectedNomination.video_url}
										</a>
									</div>
								)}

								{selectedNomination.payment_screenshot_url && (
									<div>
										<label className="text-white/50 text-sm mb-2 block">Payment Screenshot</label>
										{selectedNomination.payment_number && (
											<p className="text-white/70 text-sm mb-2">Payment Number: {selectedNomination.payment_number}</p>
										)}
										<a
											href={selectedNomination.payment_screenshot_url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block"
										>
											<img
												src={selectedNomination.payment_screenshot_url}
												alt="Payment screenshot"
												className="max-w-full h-auto rounded-lg border border-white/10 max-h-96"
											/>
										</a>
									</div>
								)}

								{selectedNomination.status === "pending" && (
									<div className="flex gap-3 pt-4 border-t border-white/10">
										<button
											onClick={() => {
												handleStatusUpdate(selectedNomination.id, "approved");
												setSelectedNomination(null);
											}}
											disabled={updating === selectedNomination.id}
											className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg transition-colors font-semibold"
										>
											<Check className="w-5 h-5" />
											Approve Nomination
										</button>
										<button
											onClick={() => {
												handleStatusUpdate(selectedNomination.id, "rejected");
												setSelectedNomination(null);
											}}
											disabled={updating === selectedNomination.id}
											className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-3 rounded-lg transition-colors font-semibold"
										>
											<X className="w-5 h-5" />
											Reject Nomination
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</AdminGuard>
	);
}

