import { Lightbulb } from "lucide-react";

export function TreatmentTip() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-tertiary-fixed/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Lightbulb size={15} strokeWidth={1.75} className="text-[#006622]" />
      </div>
      <div>
        <p className="font-display text-title-md font-semibold text-on-surface mb-1">Treatment Tip</p>
        <p className="text-body-md text-on-surface/55">
          Rotate injection sites between your abdomen, thigh, and upper arm to reduce irritation.
        </p>
      </div>
    </div>
  );
}
