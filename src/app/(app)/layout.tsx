import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export const dynamic = 'force-dynamic';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface max-w-lg mx-auto">
      <AppHeader />
      <main className="pt-0">{children}</main>
      <BottomNav />
    </div>
  );
}
