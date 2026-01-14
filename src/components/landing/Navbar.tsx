"use client";
import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useNetworkInfo } from "@/contexts/NetworkInfoContext";

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isOpen } = useNetworkInfo();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const update = () => {
        const current = window.scrollY;

        setScrolled(current > 10);

        if (current > lastScrollY && current > 100) {
          setVisible(false);
        } else {
          setVisible(true);
        }

        setLastScrollY(current);
        ticking = false;
      };

      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Core Principles", href: "#core-principles" },
    { name: "Token Mechanics", href: "#token-mechanics" },
    { name: "How It Works", href: "#how-it-works" },
    {
      name: "Documentation",
      href: process.env.NEXT_PUBLIC_DOCUMENTATION_URL || "",
      target: "_blank",
    },
  ];

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);

      // Tutup menu dengan callback setelah animasi selesai
      setMenuOpen(false);

      // Gunakan requestAnimationFrame untuk memastikan render selesai
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = document.getElementById(targetId);

          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            window.location.hash = href;
          }
        });
      });
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-600 ${
          scrolled ? "backdrop-blur-xl " : "bg-transparent"
        } ${visible && !isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/logo1.png" alt="Logo" width={60} height={60} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-1 py-2 text-lg transition-colors text-slate-400 hover:text-white"
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/app/pilot"
                className="block px-4 py-3 primary-button rounded transition-all text-center font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Launch App
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <XMarkIcon className="w-6 h-6 text-white" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-slate-800 z-40"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/app/pilot"
                className="block px-4 py-3 primary-button rounded transition-all text-center font-medium"
                onClick={() => setMenuOpen(false)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
