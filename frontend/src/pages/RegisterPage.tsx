import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import { ApiError } from "../lib/api";

const inputClass =
  "w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({
        company_name: companyName,
        owner_name: ownerName,
        email,
        password,
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível cadastrar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Cadastrar empresa"
      subtitle="Crie a conta da sua empresa em menos de um minuto."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm" style={{ color: "var(--sf-ink)" }}>
            Nome da empresa
          </label>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Climatiza VV"
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm" style={{ color: "var(--sf-ink)" }}>
            Seu nome
          </label>
          <input
            required
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Arthur"
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm" style={{ color: "var(--sf-ink)" }}>
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@empresa.com.br"
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm" style={{ color: "var(--sf-ink)" }}>
            Senha
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 6 caracteres"
            className={inputClass}
            style={{ borderColor: "var(--sf-line)" }}
          />
        </div>

        {error && (
          <p className="text-sm" style={{ color: "var(--sf-red)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "var(--sf-teal)" }}
        >
          {submitting ? "Criando conta..." : "Criar conta"}
        </button>

        <p className="mt-2 text-sm" style={{ color: "var(--sf-ink-soft)" }}>
          Já tem conta?{" "}
          <Link to="/entrar" style={{ color: "var(--sf-teal-dark)" }}>
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
