interface StatCardProps {
  label: string;
  value: string;
  accent?: "teal" | "copper" | "green" | "gray";
}

const accentColor: Record<NonNullable<StatCardProps["accent"]>, string> = {
  teal: "var(--sf-teal)",
  copper: "var(--sf-copper)",
  green: "var(--sf-green)",
  gray: "var(--sf-gray)",
};

export function StatCard({ label, value, accent = "gray" }: StatCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-md border px-4 py-3"
      style={{ borderColor: "var(--sf-line)", background: "var(--sf-surface)" }}
    >
      <span
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: accentColor[accent] }}
      />
      <p className="pl-2 text-xs" style={{ color: "var(--sf-ink-soft)" }}>
        {label}
      </p>
      <p
        className="pl-2 pt-1 text-2xl"
        style={{ fontFamily: "var(--font-mono)", color: "var(--sf-ink)" }}
      >
        {value}
      </p>
    </div>
  );
}
