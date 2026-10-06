import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError } from "../lib/api";
import type { Client } from "../lib/types";
import { formatDate } from "../lib/format";

const inputClass =
  "w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2";

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    api.listClients().then(setClients).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.createClient({
        name,
        phone: phone || undefined,
        email: email || undefined,
        address: address || undefined,
      });
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar o cliente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-medium" style={{ color: "var(--sf-ink)" }}>
        Clientes
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--sf-ink-soft)" }}>
        Cadastro de clientes da empresa.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {loading ? (
            <p className="text-sm" style={{ color: "var(--sf-ink-soft)" }}>
              Carregando...
            </p>
          ) : clients.length === 0 ? (
            <div
              className="rounded-md border px-4 py-6 text-sm"
              style={{ borderColor: "var(--sf-line)", color: "var(--sf-ink-soft)" }}
            >
              Nenhum cliente cadastrado ainda. Use o formulário ao lado para
              adicionar o primeiro.
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border" style={{ borderColor: "var(--sf-line)" }}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr
                    className="border-b text-xs"
                    style={{ borderColor: "var(--sf-line)", color: "var(--sf-ink-soft)" }}
                  >
                    <th className="px-4 py-2 font-normal">Nome</th>
                    <th className="px-4 py-2 font-normal">Telefone</th>
                    <th className="px-4 py-2 font-normal">Endereço</th>
                    <th className="px-4 py-2 font-normal">Desde</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="border-b last:border-0" style={{ borderColor: "var(--sf-line)" }}>
                      <td className="px-4 py-2.5">{c.name}</td>
                      <td className="px-4 py-2.5" style={{ color: "var(--sf-ink-soft)" }}>
                        {c.phone || "—"}
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "var(--sf-ink-soft)" }}>
                        {c.address || "—"}
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "var(--sf-ink-soft)" }}>
                        {formatDate(c.created_at)}
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
            Novo cliente
          </p>
          <input
            required
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />
          <input
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />
          <input
            type="email"
            placeholder="E-mail (opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />
          <textarea
            placeholder="Endereço"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            disabled={submitting}
            className="mt-1 rounded-md px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--sf-teal)" }}
          >
            {submitting ? "Salvando..." : "Adicionar cliente"}
          </button>
        </form>
      </div>
    </div>
  );
}
