"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/home", label: "HOME", icon: "🏠" },
  { href: "/meds", label: "MEDS", icon: "💊" },
  { href: "/diet", label: "DIET", icon: "🥗" },
  { href: "/activity", label: "ACTIVITY", icon: "🏃" },
  { href: "/profile", label: "PROFILE", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass shadow-[0_-4px_16px_rgba(25,28,30,0.04)] z-40">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-on-surface/50"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[0.625rem] font-semibold uppercase tracking-wider">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
