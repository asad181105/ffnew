import Head from "next/head";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

const items = [
	{ href: "/admin/home", title: "Home Page Settings", desc: "Hero video, autoplay, fallback" },
	{ href: "/admin/attendees", title: "Attendees", desc: "View, approve/reject, export" },
	{ href: "/admin/email", title: "Email & Ticket", desc: "Subject, body, sender, auto-send" },
	{ href: "/admin/about", title: "About Page Controls", desc: "2023/2024 metrics, images, rotation" },
	{ href: "/admin/participation", title: "Business Participation Settings", desc: "Why Us, Benefits, Complementary" },
	{ href: "/admin/partners", title: "Partners Page Settings", desc: "Gov, Sponsors, Influencers" },
	{ href: "/admin/awards", title: "Awards Module", desc: "Winners, Why awards, Categories" },
	{ href: "/admin/team", title: "Team Members", desc: "Manage team grid" },
	{ href: "/admin/contact", title: "Contact Settings", desc: "Contact info & queries" },
];

export default function AdminLanding() {
	return (
		<div className="min-h-screen bg-black text-white">
			<Head><title>Dashboard – Admin</title></Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<AdminGuard>
					<h1 className="text-2xl font-bold text-primary-yellow mb-6">Superadmin Dashboard</h1>
					<p className="text-white/70 mb-8">Select a module to manage site content and settings.</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{items.map((it) => (
							<Link key={it.href} href={it.href} className="group rounded-xl bg-white/5 border border-white/10 p-5 hover:bg-white/8 transition-colors">
								<div className="flex items-start justify-between">
									<h2 className="text-lg font-semibold text-white group-hover:text-primary-yellow transition-colors">{it.title}</h2>
									<span className="text-primary-yellow opacity-80">→</span>
								</div>
								<p className="text-white/70 mt-2 text-sm">{it.desc}</p>
							</Link>
						))}
					</div>
				</AdminGuard>
			</main>
		</div>
	);
}


