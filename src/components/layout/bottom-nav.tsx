"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pill, UtensilsCrossed, Activity, User } from "lucide-react";

const tabs = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/meds", label: "Meds", Icon: Pill },
  { href: "/diet", label: "Diet", Icon: UtensilsCrossed },
  { href: "/activity", label: "Activity", Icon: Activity },
  { href: "/profile", label: "Profile", Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass shadow-[0_-4px_16px_rgba(25,28,30,0.04)] z-40">
      <div className="max-w-lg mx-auto flex justify-around py-2 pb-safe">
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="flex flex-col items-center gap-1 px-3 py-1.5"
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.75}
                className={isActive ? "text-primary" : "text-on-surface/30"}
              />
              <span
                className={`w-1 h-1 rounded-full transition-opacity ${
                  isActive ? "bg-primary opacity-100" : "opacity-0"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
