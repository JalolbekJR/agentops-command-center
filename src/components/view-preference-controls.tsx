"use client";

import { useDemoState, type ThemeMode, type UiMode } from "@/lib/demo-state";

const uiOptions: Array<{ value: UiMode; label: string; helper: string }> = [
  { value: "simple", label: "Simple", helper: "Shows current state and next action." },
  { value: "professional", label: "Pro", helper: "Shows traces, policies, scores, and audit context." }
];

const themeOptions: Array<{ value: ThemeMode; label: string; helper: string }> = [
  { value: "dark", label: "Dark", helper: "Premium dark command center." },
  { value: "light", label: "Light", helper: "Lavender light workspace." }
];

function SegmentedGroup<TValue extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: TValue;
  options: Array<{ value: TValue; label: string; helper: string }>;
  onChange: (value: TValue) => void;
}) {
  const activeIndex = Math.max(0, options.findIndex((option) => option.value === value));

  return (
    <div className="view-segment" data-active-index={activeIndex} aria-label={label}>
      <span className="view-segment-indicator" aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          title={`${option.label}: ${option.helper}`}
          onClick={() => onChange(option.value)}
          className="view-option focus-ring"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ViewPreferenceControls({ className = "" }: { className?: string }) {
  const { themeMode, setThemeMode, uiMode, setUiMode } = useDemoState();

  return (
    <section className={["view-switcher", className].filter(Boolean).join(" ")} aria-label="View controls">
      <span className="view-switcher-label">View</span>
      <div className="view-switcher-groups">
        <SegmentedGroup label="Display mode" value={uiMode} options={uiOptions} onChange={setUiMode} />
        <span className="view-switcher-divider" aria-hidden="true" />
        <SegmentedGroup label="Color theme" value={themeMode} options={themeOptions} onChange={setThemeMode} />
      </div>
    </section>
  );
}
