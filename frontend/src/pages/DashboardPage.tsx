import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Client, DashboardStats, Job } from "../lib/types";
import { StatCard } from "../components/StatCard";
import { StatusTag } from "../components/StatusTag";
import { formatCurrency, formatDate } from "../lib/format";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.dashboardSummary(), api.listJobs(), api.listClients()])
      .then(([s, j, c]) => {
        setStats(s);
        setJobs(j.slice(0, 8));
        setClients(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const clientName = (id: number) => clients.find((c) => c.id === id)?.name ?? `Cliente #${id}`;

  return (
    <div>
      <h1 className="text-xl font-medium" style={{ color: "var(--sf-ink)" }}>
        Dashboard
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sf-ink-soft)" }}>
        Visão geral da operação.
      </p>

      {loading ? (
        <p className="mt-8 text-sm" style={{ color: "var(--sf-ink-soft)" }}>
          Carregando...
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Clientes" value={String(stats?.clients ?? 0)} accent="teal" />
            <StatCard label="OS em aberto" value={String(stats?.open_jobs ?? 0)} accent="copper" />
            <StatCard label="Receita (concluídas)" value={formatCurrency(stats?.revenue ?? 0)} accent="green" />
            <StatCard label="Pipeline (em aberto)" value={formatCurrency(stats?.pipeline ?? 0)} accent="gray" />
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-medium" style={{ color: "var(--sf-ink)" }}>
              Ordens de serviço recentes
            </h2>

            {jobs.length === 0 ? (
              <div
                className="mt-3 rounded-md border px-4 py-6 text-sm"
                style={{ borderColor: "var(--sf-line)", color: "var(--sf-ink-soft)" }}
              >
                Nenhuma ordem de serviço ainda. Crie a primeira na aba{" "}
                <span style={{ color: "var(--sf-teal-dark)" }}>Ordens de serviço</span>.
              </div>
            ) : (
              <div
                className="mt-3 overflow-hidden rounded-md border"
                style={{ borderColor: "var(--sf-line)" }}
              >
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr
                      className="border-b text-xs"
                      style={{ borderColor: "var(--sf-line)", color: "var(--sf-ink-soft)" }}
                    >
                      <th className="px-4 py-2 font-normal">Cliente</th>
                      <th className="px-4 py-2 font-normal">Serviço</th>
                      <th className="px-4 py-2 font-normal">Status</th>
                      <th className="px-4 py-2 font-normal">Data</th>
                      <th className="px-4 py-2 text-right font-normal">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b last:border-0"
                        style={{ borderColor: "var(--sf-line)" }}
                      >
                        <td className="px-4 py-2.5">{clientName(job.client_id)}</td>
                        <td className="px-4 py-2.5">{job.title}</td>
                        <td className="px-4 py-2.5">
                          <StatusTag status={job.status} />
                        </td>
                        <td className="px-4 py-2.5" style={{ color: "var(--sf-ink-soft)" }}>
                          {formatDate(job.created_at)}
                        </td>
                        <td
                          className="px-4 py-2.5 text-right"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {formatCurrency(job.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
