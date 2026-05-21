"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "대시보드" },
  { href: "/workers", label: "근로자" },
  { href: "/examinations", label: "검진 기록" },
  { href: "/calendar", label: "캘린더" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-1">
        <span className="font-semibold text-slate-900 mr-4">🏥 특수건강진단</span>
        <nav className="flex items-center gap-1 flex-1">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  active
                    ? "bg-brand-50 text-brand-700 font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="text-sm text-slate-500 hover:text-slate-900 px-2"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
