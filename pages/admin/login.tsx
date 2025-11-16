import Head from "next/head";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

export default function AdminLogin() {
	const router = useRouter();
	const DEFAULT_ADMIN_EMAIL = "ceo@edventurepark.com";
	const DEFAULT_ADMIN_PASSWORD = "123456789";
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const signIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage(null);
		setLoading(true);
		const isDefaultAdmin = email.trim().toLowerCase() === DEFAULT_ADMIN_EMAIL;
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password: isDefaultAdmin ? DEFAULT_ADMIN_PASSWORD : password,
		});
		setLoading(false);
		if (error) {
			setMessage(error.message);
			return;
		}
		setMessage("Signed in.");
		router.replace("/admin");
	};

	const signInDefault = async () => {
		setMessage(null);
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: "ceo@edventurepark.com",
			password: "123456789",
		});
		setLoading(false);
		if (error) {
			setMessage(error.message);
			return;
		}
		setMessage("Signed in.");
		router.replace("/admin");
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Head><title>Admin Login</title></Head>
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-xl p-6">
					<h1 className="text-2xl font-bold text-primary-yellow mb-4">Admin Login</h1>
					<form onSubmit={signIn} className="space-y-4">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email (admin: ceo@edventurepark.com)"
							required
							className="w-full rounded-md bg-black/40 border border-white/10 p-3"
						/>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password (auto if admin email)"
							required
							className="w-full rounded-md bg-black/40 border border-white/10 p-3"
						/>
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-primary-yellow text-black font-semibold px-4 py-3 rounded-md"
						>
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</form>
					<div className="mt-4">
						<button
							onClick={signInDefault}
							disabled={loading}
							className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-3 rounded-md"
						>
							{loading ? "Signing in..." : "Use default admin"}
						</button>
					</div>
					{message && <p className="mt-4 text-white/80">{message}</p>}
					<p className="mt-4 text-sm text-white/60">
						Note: This page expects you to have an Auth user in Supabase and a matching entry in the `admins` table.
					</p>
				</div>
			</main>
		</div>
	);
}


