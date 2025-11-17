import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavbarVariant = "floating" | "static";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Participate", href: "/participate" },
  { name: "Awards", href: "/awards" },
  { name: "Partners", href: "/partners" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar({ variant = "static" }: { variant?: NavbarVariant }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const wrapperClasses =
    variant === "floating"
      ? "absolute top-6 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4"
      : "relative z-40 w-full px-4 pt-6 sm:px-6 lg:px-8";

  const navClasses =
    "flex items-center justify-between gap-6 rounded-full border border-white/10 bg-white/10 px-6 py-0.5 text-white backdrop-blur-2xl shadow-lg shadow-black/20";

  return (
    <div className={wrapperClasses}>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={navClasses}
      >
        <Link href="/" className="flex items-center gap-1">
          <img src="/logo.png" className="h-16 w-auto" alt="Founders Fest" />
        </Link>

        <div className="hidden items-center gap-6 text-lg font-medium md:flex font-gta">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? router.pathname === item.href
                : router.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-primary-yellow font-gta",
                  isActive ? "text-primary-yellow" : "text-white/70"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {/* <Link
            href="/register"
            className="rounded-full border border-primary-yellow px-4 py-2 text-sm font-semibold text-white hover:bg-primary-yellow hover:text-black transition-colors font-gta"
          >
            Try for free
          </Link> */}
          <Link
            href="/register"
            className="rounded-full bg-primary-yellow px-4 py-2 text-sm font-semibold text-black hover:bg-primary-yellow/90 transition-colors font-gta"
          >
            Register
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="rounded-full border border-white/20 p-2 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl text-white md:hidden"
          >
            <div className="flex flex-col divide-y divide-white/10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-6 py-4 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors font-gta"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between gap-2 px-6 py-4">
                <Link
                  href="/register"
                  className="flex-1 rounded-full border border-primary-yellow px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-yellow hover:text-black transition-colors font-gta"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Try for free
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 rounded-full bg-primary-yellow px-4 py-2 text-center text-sm font-semibold text-black hover:bg-primary-yellow/90 transition-colors font-gta"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book a demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
