import React, { useEffect, useState, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
import Countdown from "./Countdown";

type Easing = (t: number) => number;
const easeInCubic: Easing = (t) => t * t * t;

interface HeroProps {
  onAnimationComplete?: () => void;
}

export default function Hero({ onAnimationComplete }: HeroProps): JSX.Element {
  const router = useRouter();
  const heroImageControls = useAnimation();

  const [showTexts, setShowTexts] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasPlayedAnimation, setHasPlayedAnimation] = useState<boolean | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const heroImageSrc = useMemo(() => "/logo.png", []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ];

  // --- Run only once after hydration (check localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const played = localStorage.getItem("hasPlayedHeroAnimation") === "true";
    setHasPlayedAnimation(played); // null → true/false
  }, []);

  // --- The animation itself
  const startAnimation = React.useCallback(() => {
    heroImageControls
      .start({
        scale: [0, 1, 1],
        opacity: [1, 1, 0],
        transition: {
          duration: 1.5,
          ease: "easeOut",
          times: [0, 0.6, 1],
        },
      })
      .then(() => {
        setHasPlayedAnimation(true);
        localStorage.setItem("hasPlayedHeroAnimation", "true");
        setShowTexts(true);
        onAnimationComplete?.();
      })
      .catch(() => {
        setHasPlayedAnimation(true);
        setShowTexts(true);
        onAnimationComplete?.();
      });
  }, [heroImageControls, onAnimationComplete]);

  // --- Start animation only once after image is loaded
  useEffect(() => {
    if (hasPlayedAnimation === null) return; // wait for hydration
    if (hasPlayedAnimation) {
      // Already played → skip
      setShowTexts(true);
      onAnimationComplete?.();
      return;
    }

    if (imageLoaded) {
      const t = setTimeout(startAnimation, 200);
      return () => clearTimeout(t);
    }
  }, [imageLoaded, hasPlayedAnimation, startAnimation, onAnimationComplete]);

  return (
    <section
      className="relative w-full bg-transparent overflow-hidden"
      aria-label="Founders Fest Hero"
      style={{
        paddingTop: "0",
        paddingBottom: "10px",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -100 }}
        animate={showTexts ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-2">
              <motion.img
                src="/logo.png"
                alt="Founders Fest"
                whileHover={{ scale: 1.05 }}
                className="h-24 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative group px-3 py-2 rounded-lg transition-all duration-300"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-primary-yellow rounded-lg ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                      transition={{ duration: 0.3 }}
                    />
                    <span
                      className={`relative z-10 font-gta font-medium text-xl ${
                        isActive
                          ? "text-primary-black"
                          : "text-primary-white group-hover:text-primary-black"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-primary-white hover:text-primary-yellow transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-2"
            >
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-xl font-gta font-medium ${
                      isActive
                        ? "bg-primary-yellow text-primary-black"
                        : "text-primary-white hover:bg-primary-yellow hover:text-primary-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/bgvideo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Logo Intro (only first visit) */}
      {hasPlayedAnimation === false && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[50]"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.95)",
          }}
        >
          <motion.img
            src={heroImageSrc}
            alt="Founders Fest 2025-26"
            initial={{ scale: 0, opacity: 1 }}
            animate={heroImageControls}
            className="w-[50vw] max-w-[600px] h-auto object-contain"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-[3]">
        <div className="text-center flex flex-col items-center justify-center w-full max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showTexts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2 }}
            className="mb-8 w-full flex justify-center"
          >
            <img
              src="/hero.svg"
              alt="Founders Fest 2025-26"
              className="w-full max-w-[1200px] h-auto"
            />
          </motion.div>

          <motion.a
            href="https://forms.gle/4hufj4eBF3jETaoM7"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={showTexts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-4 inline-block bg-primary-yellow text-primary-black px-10 py-4 rounded-lg font-gta font-bold text-2xl uppercase tracking-wider shadow-lg hover:shadow-primary-yellow/50 transition-all duration-300"
          >
            Book Your Stall Now
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={showTexts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="mt-2 w-full flex items-center justify-center"
            style={{ transform: "scale(0.9)" }}
          >
            <Countdown />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
