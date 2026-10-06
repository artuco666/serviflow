import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div
        className="hidden w-[38%] flex-col justify-between px-10 py-12 text-left md:flex"
        style={{ background: "var(--sf-teal-dark)" }}
      >
        <p
          className="text-xl tracking-tight text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ServiFlow
        </p>
        <div className="max-w-sm">
          <p
            className="text-2xl leading-snug text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            O sistema operacional das empresas de serviço.
          </p>
          <p className="mt-4 text-sm" style={{ color: "#BFE0DC" }}>
            Clientes, ordens de serviço e faturamento em um só lugar — pensado
            para empresas de climatização e refrigeração.
          </p>
        </div>
        <p className="text-xs" style={{ color: "#8FC4BE" }}>
          Milestone 1 · backend estruturado
        </p>
      </div>

      <div
        className="flex flex-1 items-center justify-center px-6 py-12"
        style={{ background: "var(--sf-bg)" }}
      >
        <div className="w-full max-w-sm text-left">
          <h1 className="text-xl font-medium" style={{ color: "var(--sf-ink)" }}>
            {title}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--sf-ink-soft)" }}>
            {subtitle}
          </p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
