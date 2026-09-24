"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  PlusCircle,
  Store,
  MessageCircle,
  Heart,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";

type Me = {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    storeName: string | null;
  } | null;
};

export default function Navbar() {
  const [user, setUser] = useState<Me["user"]>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d: Me) => setUser(d.user))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/listings?q=${encodeURIComponent(q.trim())}`);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        pathname === href
          ? "bg-brand-600 text-white"
          : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-white/60 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <span className="font-cairo text-xl font-black tracking-tight text-slate-900">
            ZERO<span className="text-gradient">STORE</span>
          </span>
        </Link>

        <nav className="hidden items-center md:flex md:ms-6">
          {navLink("/", "الرئيسية")}
          {navLink("/listings", "السوق")}
          {navLink("/listings?sort=views", "الأكثر مشاهدة")}
        </nav>

        <form onSubmit={submitSearch} className="ms-auto hidden flex-1 max-w-md lg:flex">
          <div className="group flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن منتج، ماركة، مدينة…"
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>
        </form>

        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <Link
            href="/post"
            className="btn-3d hidden items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white sm:flex"
          >
            <PlusCircle className="h-4 w-4" />
            أضف إعلانك
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pe-3 ps-1.5 shadow-sm transition hover:border-brand-300"
              >
                <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </span>
                <span className="max-w-24 truncate text-sm font-bold text-slate-800">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute left-0 top-12 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-brand-900/10"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="font-cairo font-extrabold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.storeName || user.email}</p>
                    </div>
                    <div className="p-2">
                      <MenuItem icon={<Store className="h-4 w-4" />} label="لوحة تحكمي / متجري" href="/profile" />
                      <MenuItem icon={<MessageCircle className="h-4 w-4" />} label="محادثاتي" href="/chat" />
                      <MenuItem icon={<PlusCircle className="h-4 w-4" />} label="إعلاناتي" href="/profile?tab=ads" />
                      <MenuItem icon={<Heart className="h-4 w-4" />} label="المفضلة" href="/profile?tab=favs" />
                      <MenuItem icon={<User className="h-4 w-4" />} label="إعدادات المتجر" href="/profile?tab=store" />
                    </div>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-sm font-bold text-rose-500 transition hover:bg-rose-50/60"
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-brand-400 hover:text-brand-700"
              >
                حساب جديد
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="القائمة"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              <form onSubmit={submitSearch} className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ابحث في السوق…"
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </form>
              <MobileLink href="/" label="الرئيسية" />
              <MobileLink href="/listings" label="السوق" />
              <MobileLink href="/post" label="أضف إعلانك" />
              <MobileLink href="/chat" label="محادثاتي" />
              {!user && <MobileLink href="/register" label="إنشاء حساب" />}
              {!user && <MobileLink href="/login" label="تسجيل الدخول" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
    >
      <span className="text-brand-600">{icon}</span>
      {label}
    </Link>
  );
}

function MobileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block rounded-xl px-4 py-3 text-base font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
      {label}
    </Link>
  );
}