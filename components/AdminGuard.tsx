import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [allowed, setAllowed] = useState<boolean | null>(null);

	useEffect(() => {
		let mounted = true;
		const check = async () => {
			const { data: sessionRes } = await supabase.auth.getSession();
			const user = sessionRes.session?.user;
			if (!user) {
				if (mounted) setAllowed(false);
				router.replace("/admin/login");
				return;
			}
			const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
			if (!mounted) return;
			if (data?.user_id) {
				setAllowed(true);
			} else {
				setAllowed(false);
				router.replace("/admin/login");
			}
		};
		check();
		return () => { mounted = false; };
	}, [router]);

	if (allowed === null) {
		return <div className="min-h-[40vh] flex items-center justify-center text-white/70">Checking access...</div>;
	}
	if (!allowed) return null;
	return <>{children}</>;
}


