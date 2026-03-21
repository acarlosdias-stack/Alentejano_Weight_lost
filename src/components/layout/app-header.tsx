import { Bell } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 glass px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full vitality-gradient flex items-center justify-center flex-shrink-0">
          <span className="font-display font-extrabold text-white text-xs">A</span>
        </div>
        <div>
          <p className="font-display font-bold text-title-md text-on-surface leading-none">AWM</p>
          <p className="text-[0.625rem] font-body text-on-surface/40 leading-none mt-0.5">Weight Mission</p>
        </div>
      </div>
      <button type="button" aria-label="Notifications" className="text-on-surface/35 p-1">
        <Bell size={18} strokeWidth={1.75} />
      </button>
    </header>
  );
}
