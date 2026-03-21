import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface max-w-lg mx-auto">
      <AppHeader />
      <main className="px-5 pb-24 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
