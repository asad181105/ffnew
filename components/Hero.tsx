import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
import Countdown from "./Countdown";
import { supabase } from "@/lib/supabase";

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
  const [videoAutoplay, setVideoAutoplay] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string>("/bgvideo.mp4");
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playButtonImageUrl, setPlayButtonImageUrl] = useState<string | null>(null);
  const [pauseButtonImageUrl, setPauseButtonImageUrl] = useState<string | null>(null);

  const heroImageSrc = useMemo(() => "/logo.png", []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/participate", label: "Be a Part" },
    { href: "/awards", label: "Awards" },
    { href: "/team", label: "Team" },
    { href: "/partners", label: "Partners" },
    { href: "/contact", label: "Contact" },
    { href: "/register", label: "Register" },
  ];

  // --- Run only once after hydration (check localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const played = localStorage.getItem("hasPlayedHeroAnimation") === "true";
    setHasPlayedAnimation(played); // null → true/false
  }, []);

  // --- Load hero settings from Supabase
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("home_settings")
        .select("video_url, autoplay, fallback_image_url, play_button_image_url, pause_button_image_url")
        .eq("id", 1)
        .single();
      if (!isMounted) return;
      if (!error && data) {
        setVideoAutoplay(Boolean(data.autoplay));
        setVideoSrc(data.video_url || "/bgvideo.mp4");
        setFallbackImage(data.fallback_image_url || null);
        setPlayButtonImageUrl(data.play_button_image_url || null);
        setPauseButtonImageUrl(data.pause_button_image_url || null);
      }
    };
    fetchSettings();
    return () => {
      isMounted = false;
    };
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

  // --- Control autoplay behavior once settings and ref are ready
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (videoAutoplay) {
      el.play().then(() => setIsVideoPlaying(true)).catch(() => setIsVideoPlaying(false));
    } else {
      el.pause();
      setIsVideoPlaying(false);
    }
  }, [videoAutoplay]);

  const handlePlayPause = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setIsVideoPlaying(true)).catch(() => setIsVideoPlaying(false));
    } else {
      el.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <section
      className="relative w-full bg-transparent overflow-hidden min-h-[100svh] md:min-h-[110vh]"
      aria-label="Founders Fest Hero"
      style={{
        paddingTop: "0",
        paddingBottom: "10px",
        position: "relative",
        backgroundColor: "transparent",
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
              className="md:hidden py-4 space-y-2 bg-black/80 backdrop-blur-sm rounded-lg mt-2"
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
        {fallbackImage && !isVideoPlaying && (
          <img
            src={fallbackImage}
            alt="Hero background"
            className="absolute w-full h-full object-cover object-top md:object-center min-w-full min-h-full"
          />
        )}
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover object-top md:object-center min-w-full min-h-full"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
          }}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-black/15 to-black/30" />

      {/* Play/Pause Control - image-based if configured, else fallback to button */}
      <div className="absolute z-[100] left-1/2 -translate-x-1/2 bottom-8">
        {((!isVideoPlaying && playButtonImageUrl) || (isVideoPlaying && pauseButtonImageUrl)) ? (
          <img
            src={isVideoPlaying ? (pauseButtonImageUrl as string) : (playButtonImageUrl as string)}
            alt={isVideoPlaying ? "Pause video" : "Play video"}
            onClick={handlePlayPause}
            className="h-12 w-auto cursor-pointer select-none drop-shadow-[0_0_12px_rgba(0,0,0,0.35)] hover:scale-105 transition-transform"
          />
        ) : (
          <button
            onClick={handlePlayPause}
            className="bg-primary-yellow text-primary-black px-5 py-2 rounded-md font-gta font-semibold shadow-lg hover:shadow-primary-yellow/50 transition-all"
          >
            {isVideoPlaying ? "Pause Video" : "Play Video"}
          </button>
        )}
      </div>

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
      <div className="absolute inset-0 flex items-center justify-center z-[3] overflow-hidden">
        <div className="text-center flex flex-col items-center justify-center w-full max-w-7xl px-4 sm:px-6 pt-2 sm:pt-3 pb-4 sm:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showTexts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2 }}
            className="mt-2 sm:mt-3 mb-4 sm:mb-6 md:mb-8 w-full flex justify-center"
          >
            <img
              src="/hero.svg"
              alt="Founders Fest 2025-26"
              className="w-full max-w-[85vw] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[500px] h-auto"
            />
          </motion.div>

          <motion.a
            href="/register"
            initial={{ opacity: 0, y: 16 }}
            animate={showTexts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-3 sm:mb-4 inline-block bg-primary-yellow text-primary-black px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-lg font-gta font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-wider shadow-lg hover:shadow-primary-yellow/50 transition-all duration-300"
          >
            Register Now
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={showTexts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="w-full flex items-center justify-center px-2 sm:px-4"
          >
            <div className="scale-75 sm:scale-90 md:scale-100">
              {/* <Countdown /> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
