"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/companion", label: "AI Companion" },
  { href: "/document-assistant", label: "Documents" },
  { href: "/issue-reporter", label: "Issue Reporter" },
  { href: "/scheme-finder", label: "Schemes" },
];

const languages = [
  { code: "en", label: "EN", flag: "🇮🇳" },
  { code: "hi", label: "HI", flag: "🅗" },
  { code: "te", label: "TE", flag: "🅣" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");

  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-navy-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-saffron group-hover:scale-110 transition-transform">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg">
            Smart<span className="text-saffron">Bharat</span>
            <span className="text-gray-400 font-normal text-sm ml-1">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-saffron/15 text-saffron border border-saffron/25"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language selector + Mobile menu */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-white/10 text-xs font-medium">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  // Store globally for API calls
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem("sb_lang", l.code);
                  }
                }}
                className={`px-2.5 py-1.5 transition-colors ${
                  lang === l.code
                    ? "bg-saffron text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                aria-label={`Switch to ${l.label}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/8 bg-navy-900 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-saffron/15 text-saffron"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
