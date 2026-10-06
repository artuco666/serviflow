import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError } from "../lib/api";
import type { Client, Job, JobStatus } from "../lib/types";
import { StatusTag } from "../components/StatusTag";
import { formatCurrency, formatDate } from "../lib/format";

const inputClass =
  "w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2";

const STATUSES: JobStatus[] = ["Novo", "Agendado", "Em Execução", "Concluído", "Cancelado"];
const FILTERS: Array<JobStatus | "Todas"> = ["Todas", ...STATUSES];

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<JobStatus | "Todas">("Todas");

  const [clientId, setClientId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([api.listJobs(), api.listClients()])
      .then(([j, c]) => {
        setJobs(j);
        setClients(c);
        if (!clientId && c.length > 0) setClientId(String(c[0].id));
      })
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  const clientName = (id: number) => clients.find((c) => c.id === id)?.name ?? `Cliente #${id}`;

  const filteredJobs = useMemo(
    () => (filter === "Todas" ? jobs : jobs.filter((j) => j.status === filter)),
    [jobs, filter],
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!clientId) {
      setError("Cadastre um cliente antes de abrir uma ordem de serviço.");
      return;
    }
    setSubmitting(true);
    try {
      await api.createJob({
        client_id: Number(clientId),
        title,
        value: Number(value) || 0,
        notes: notes || undefined,
      });
      setTitle("");
      setValue("");
      setNotes("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar a OS.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(job: Job, status: JobStatus) {
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status } : j)));
    try {
      await api.updateJobStatus(job.id, status);
    } catch {
      load(); // reverte em caso de falha
    }
  }

  return (
    <div>
      <h1 className="text-xl font-medium" style={{ color: "var(--sf-ink)" }}>
        Ordens de serviço
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sf-ink-soft)" }}>
        Acompanhe e atualize o status de cada OS.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 flex gap-4 border-b text-sm" style={{ borderColor: "var(--sf-line)" }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="border-b-2 pb-2 transition-colors"
                style={{
                  borderColor: filter === f ? "var(--sf-teal)" : "transparent",
                  color: filter === f ? "var(--sf-teal-dark)" : "var(--sf-ink-soft)",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm" style={{ color: "var(--sf-ink-soft)" }}>
              Carregando...
            </p>
          ) : filteredJobs.length === 0 ? (
            <div
              className="rounded-md border px-4 py-6 text-sm"
              style={{ borderColor: "var(--sf-line)", color: "var(--sf-ink-soft)" }}
            >
              Nenhuma ordem de serviço nessa categoria.
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border" style={{ borderColor: "var(--sf-line)" }}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr
                    className="border-b text-xs"
                    style={{ borderColor: "var(--sf-line)", color: "var(--sf-ink-soft)" }}
                  >
                    <th className="px-4 py-2 font-normal">Cliente</th>
                    <th className="px-4 py-2 font-normal">Serviço</th>
                    <th className="px-4 py-2 font-normal">Aberta em</th>
                    <th className="px-4 py-2 text-right font-normal">Valor</th>
                    <th className="px-4 py-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="border-b last:border-0" style={{ borderColor: "var(--sf-line)" }}>
                      <td className="px-4 py-2.5">{clientName(job.client_id)}</td>
                      <td className="px-4 py-2.5">
                        {job.title}
                        {job.notes && (
                          <p className="text-xs" style={{ color: "var(--sf-ink-soft)" }}>
                            {job.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "var(--sf-ink-soft)" }}>
                        {formatDate(job.created_at)}
                      </td>
                      <td className="px-4 py-2.5 text-right" style={{ fontFamily: "var(--font-mono)" }}>
                        {formatCurrency(job.value)}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <StatusTag status={job.status} />
                          <select
                            value={job.status}
                            onChange={(e) => handleStatusChange(job, e.target.value as JobStatus)}
                            className="rounded border bg-transparent px-1.5 py-0.5 text-xs outline-none"
                            style={{ borderColor: "var(--sf-line)", color: "var(--sf-ink-soft)" }}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                mudar para: {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex h-fit flex-col gap-3 rounded-md border p-4"
          style={{ borderColor: "var(--sf-line)", background: "var(--sf-surface)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--sf-ink)" }}>
            Nova ordem de serviço
          </p>

          {clients.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--sf-ink-soft)" }}>
              Cadastre um cliente primeiro, na aba Clientes.
            </p>
          ) : (
            <select
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className={inputClass}
              style={{ borderColor: "var(--sf-line)" }}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <input
            required
            placeholder="Descrição do serviço"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Valor (R$)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />
          <textarea
            placeholder="Observações (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />

          {error && (
            <p className="text-sm" style={{ color: "var(--sf-red)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || clients.length === 0}
            className="mt-1 rounded-md px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--sf-teal)" }}
          >
            {submitting ? "Criando..." : "Criar ordem de serviço"}
          </button>
        </form>
      </div>
    </div>
  );
}
