import type { JobStatus } from "../lib/types";

const styles: Record<JobStatus, { fg: string; bg: string; border: string }> = {
  Novo: { fg: "var(--sf-ink-soft)", bg: "var(--sf-gray-tint)", border: "var(--sf-gray)" },
  Agendado: { fg: "var(--sf-blue)", bg: "var(--sf-blue-tint)", border: "var(--sf-blue)" },
  "Em Execução": { fg: "var(--sf-copper)", bg: "var(--sf-copper-tint)", border: "var(--sf-copper)" },
  "Concluído": { fg: "var(--sf-green)", bg: "var(--sf-green-tint)", border: "var(--sf-green)" },
  Cancelado: { fg: "var(--sf-red)", bg: "var(--sf-red-tint)", border: "var(--sf-red)" },
};

export function StatusTag({ status }: { status: JobStatus }) {
  const s = styles[status];
  return (
    <span
      className="inline-block border-l-2 px-2 py-0.5 text-xs font-medium"
      style={{ color: s.fg, background: s.bg, borderLeftColor: s.border }}
    >
      {status}
    </span>
  );
}
