export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 glass px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🏋️</span>
        <span className="font-display text-title-md text-on-surface font-bold">
          AlentejanoWeightMission
        </span>
      </div>
      <button type="button" className="text-on-surface/50 text-xl">🔔</button>
    </header>
  );
}
