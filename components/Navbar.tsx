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
  { href: "/profile", label: "My Profile" },
  { href: "/admin", label: "Admin" },
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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-950 group-hover:bg-saffron transition-colors shadow-sm">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-navy-950 text-xl tracking-tight">
            Smart<span className="text-saffron">Bharat</span>
            <span className="text-gray-400 font-medium text-sm ml-1">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                pathname === link.href
                  ? "bg-gray-100 text-navy-950 shadow-sm"
                  : "text-gray-500 hover:text-navy-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language selector + Mobile menu */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm text-xs font-semibold">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem("sb_lang", l.code);
                  }
                }}
                className={`px-3 py-1.5 transition-colors ${
                  lang === l.code
                    ? "bg-navy-950 text-white"
                    : "text-gray-500 hover:text-navy-900 hover:bg-gray-50"
                }`}
                aria-label={`Switch to ${l.label}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-navy-950"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                pathname === link.href
                  ? "bg-gray-100 text-navy-950"
                  : "text-gray-500 hover:text-navy-900 hover:bg-gray-50"
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
