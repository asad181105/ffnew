import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";
import { Check, X, Eye, Download } from "lucide-react";

type StallBooking = {
	id: string;
	created_at: string;
	name: string;
	startup_name: string;
	logo_url: string;
	category: string;
	business_description: string;
	contact: string;
	email: string;
	social_media_handle: string;
	stall_type: string;
	payment_screenshot_url: string;
	status: "pending" | "approved" | "rejected";
};

export default function AdminStallBookings() {
	const [bookings, setBookings] = useState<StallBooking[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedBooking, setSelectedBooking] = useState<StallBooking | null>(null);
	const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
	const [updating, setUpdating] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			const { data, error } = await supabase
				.from("stall_bookings")
				.select("*")
				.order("created_at", { ascending: false });
			if (!mounted) return;
			if (error) {
				console.error("Error loading bookings:", error);
			} else {
				setBookings((data as StallBooking[]) || []);
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
				.from("stall_bookings")
				.update({ status })
				.eq("id", id);

			if (error) throw error;

			setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
			if (selectedBooking?.id === id) {
				setSelectedBooking({ ...selectedBooking, status });
			}
		} catch (error) {
			console.error("Error updating status:", error);
			alert("Failed to update status. Please try again.");
		} finally {
			setUpdating(null);
		}
	};

	const exportToCSV = () => {
		const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
		const headers = [
			"ID",
			"Name",
			"Startup Name",
			"Category",
			"Contact",
			"Email",
			"Stall Type",
			"Status",
			"Created At",
		];
		const rows = filtered.map((b) => [
			b.id,
			b.name,
			b.startup_name,
			b.category,
			b.contact,
			b.email,
			b.stall_type,
			b.status,
			new Date(b.created_at).toLocaleString(),
		]);

		const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `stall-bookings-${filter}-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const filteredBookings = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

	const statusCounts = {
		all: bookings.length,
		pending: bookings.filter((b) => b.status === "pending").length,
		approved: bookings.filter((b) => b.status === "approved").length,
		rejected: bookings.filter((b) => b.status === "rejected").length,
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
					<title>Stall Bookings – Admin</title>
				</Head>
				<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
					<div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<Link href="/admin" className="text-primary-yellow hover:underline mb-2 inline-block">
								← Back to Dashboard
							</Link>
							<h1 className="text-2xl md:text-3xl font-bold text-primary-yellow">Stall Bookings</h1>
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

					{/* Bookings List */}
					<div className="space-y-4">
						{filteredBookings.length === 0 ? (
							<div className="text-center py-12 text-white/60">No bookings found.</div>
						) : (
							filteredBookings.map((booking) => (
								<div
									key={booking.id}
									className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 hover:bg-white/8 transition-colors"
								>
									<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
										<div className="flex-1">
											<div className="flex flex-wrap items-start gap-4 mb-4">
												{booking.logo_url && (
													<img
														src={booking.logo_url}
														alt={booking.startup_name}
														className="w-16 h-16 object-cover rounded-lg border border-white/10"
													/>
												)}
												<div className="flex-1 min-w-0">
													<h3 className="text-lg md:text-xl font-semibold text-white mb-1">{booking.startup_name}</h3>
													<p className="text-white/70 text-sm mb-2">by {booking.name}</p>
													<div className="flex flex-wrap gap-2 text-sm">
														<span className="px-2 py-1 bg-white/10 rounded text-white/80">{booking.category}</span>
														<span className="px-2 py-1 bg-white/10 rounded text-white/80">{booking.stall_type}</span>
														<span
															className={`px-2 py-1 rounded ${
																booking.status === "approved"
																	? "bg-green-500/20 text-green-300"
																	: booking.status === "rejected"
																	? "bg-red-500/20 text-red-300"
																	: "bg-yellow-500/20 text-yellow-300"
															}`}
														>
															{booking.status}
														</span>
													</div>
												</div>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/70 mb-4">
												<div>
													<span className="text-white/50">Email:</span> {booking.email}
												</div>
												<div>
													<span className="text-white/50">Contact:</span> {booking.contact}
												</div>
												<div className="sm:col-span-2">
													<span className="text-white/50">Social Media:</span>{" "}
													<a href={booking.social_media_handle} target="_blank" rel="noopener noreferrer" className="text-primary-yellow hover:underline">
														{booking.social_media_handle}
													</a>
												</div>
												<div className="sm:col-span-2">
													<span className="text-white/50">Description:</span> {booking.business_description}
												</div>
												<div className="sm:col-span-2 text-xs text-white/50">
													Submitted: {new Date(booking.created_at).toLocaleString()}
												</div>
											</div>
										</div>
										<div className="flex flex-col sm:flex-row gap-2">
											<button
												onClick={() => setSelectedBooking(booking)}
												className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
											>
												<Eye className="w-4 h-4" />
												View Details
											</button>
											{booking.status === "pending" && (
												<>
													<button
														onClick={() => handleStatusUpdate(booking.id, "approved")}
														disabled={updating === booking.id}
														className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
													>
														<Check className="w-4 h-4" />
														{updating === booking.id ? "Updating..." : "Approve"}
													</button>
													<button
														onClick={() => handleStatusUpdate(booking.id, "rejected")}
														disabled={updating === booking.id}
														className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
													>
														<X className="w-4 h-4" />
														{updating === booking.id ? "Updating..." : "Reject"}
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
				{selectedBooking && (
					<div
						className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						onClick={() => setSelectedBooking(null)}
					>
						<div
							className="bg-black border border-white/20 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-start justify-between mb-6">
								<h2 className="text-2xl font-bold text-primary-yellow">Booking Details</h2>
								<button
									onClick={() => setSelectedBooking(null)}
									className="text-white/70 hover:text-white transition-colors"
								>
									<X className="w-6 h-6" />
								</button>
							</div>

							<div className="space-y-6">
								<div className="flex items-start gap-4">
									{selectedBooking.logo_url && (
										<img
											src={selectedBooking.logo_url}
											alt={selectedBooking.startup_name}
											className="w-24 h-24 object-cover rounded-lg border border-white/10"
										/>
									)}
									<div>
										<h3 className="text-xl font-semibold text-white mb-1">{selectedBooking.startup_name}</h3>
										<p className="text-white/70">by {selectedBooking.name}</p>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-white/50 text-sm">Email</label>
										<p className="text-white">{selectedBooking.email}</p>
									</div>
									<div>
										<label className="text-white/50 text-sm">Contact</label>
										<p className="text-white">{selectedBooking.contact}</p>
									</div>
									<div>
										<label className="text-white/50 text-sm">Category</label>
										<p className="text-white">{selectedBooking.category}</p>
									</div>
									<div>
										<label className="text-white/50 text-sm">Stall Type</label>
										<p className="text-white">{selectedBooking.stall_type}</p>
									</div>
									<div className="md:col-span-2">
										<label className="text-white/50 text-sm">Social Media</label>
										<p className="text-white">
											<a href={selectedBooking.social_media_handle} target="_blank" rel="noopener noreferrer" className="text-primary-yellow hover:underline">
												{selectedBooking.social_media_handle}
											</a>
										</p>
									</div>
									<div className="md:col-span-2">
										<label className="text-white/50 text-sm">Business Description</label>
										<p className="text-white">{selectedBooking.business_description}</p>
									</div>
									<div>
										<label className="text-white/50 text-sm">Status</label>
										<p
											className={`inline-block px-3 py-1 rounded ${
												selectedBooking.status === "approved"
													? "bg-green-500/20 text-green-300"
													: selectedBooking.status === "rejected"
													? "bg-red-500/20 text-red-300"
													: "bg-yellow-500/20 text-yellow-300"
											}`}
										>
											{selectedBooking.status}
										</p>
									</div>
									<div>
										<label className="text-white/50 text-sm">Submitted</label>
										<p className="text-white">{new Date(selectedBooking.created_at).toLocaleString()}</p>
									</div>
								</div>

								<div>
									<label className="text-white/50 text-sm mb-2 block">Payment Screenshot</label>
									<a
										href={selectedBooking.payment_screenshot_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block"
									>
										<img
											src={selectedBooking.payment_screenshot_url}
											alt="Payment screenshot"
											className="max-w-full h-auto rounded-lg border border-white/10 max-h-96"
										/>
									</a>
								</div>

								{selectedBooking.status === "pending" && (
									<div className="flex gap-3 pt-4 border-t border-white/10">
										<button
											onClick={() => {
												handleStatusUpdate(selectedBooking.id, "approved");
												setSelectedBooking(null);
											}}
											disabled={updating === selectedBooking.id}
											className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg transition-colors font-semibold"
										>
											<Check className="w-5 h-5" />
											Approve Booking
										</button>
										<button
											onClick={() => {
												handleStatusUpdate(selectedBooking.id, "rejected");
												setSelectedBooking(null);
											}}
											disabled={updating === selectedBooking.id}
											className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-3 rounded-lg transition-colors font-semibold"
										>
											<X className="w-5 h-5" />
											Reject Booking
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

