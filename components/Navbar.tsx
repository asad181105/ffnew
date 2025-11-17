import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const wrapperClasses = isMobile
    ? "fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/10"
    : variant === "floating"
    ? "absolute top-6 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4"
    : "relative z-40 w-full px-4 pt-6 sm:px-6 lg:px-8";

  const navClasses =
    isMobile
      ? "flex items-center justify-between px-4 py-3 w-full"
      : "flex items-center justify-between gap-6 rounded-full border border-white/10 bg-white/10 px-6 py-0.5 text-white backdrop-blur-2xl shadow-lg shadow-black/20";

  return (
    <div className={wrapperClasses}>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={navClasses}
      >
        <Link href="/" className="flex items-center gap-1 md:gap-2">
          <img src="/logo.png" className="h-10 md:h-16 w-auto" alt="Founders Fest" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 lg:gap-6 text-base lg:text-lg font-medium md:flex font-gta">
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
                  "transition-colors hover:text-primary-yellow font-gta whitespace-nowrap",
                  isActive ? "text-primary-yellow" : "text-white/70"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/register"
            className="rounded-full bg-primary-yellow px-4 py-2 text-sm font-semibold text-black hover:bg-primary-yellow/90 transition-colors font-gta whitespace-nowrap"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </motion.nav>

      {/* Mobile Menu - Traditional Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-black/98 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col">
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
                      "px-6 py-4 text-base font-medium transition-colors font-gta border-b border-white/5",
                      isActive
                        ? "text-primary-yellow bg-white/5"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href="/register"
                className="mx-4 my-4 rounded-full bg-primary-yellow px-6 py-3 text-center text-base font-semibold text-black hover:bg-primary-yellow/90 transition-colors font-gta"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
