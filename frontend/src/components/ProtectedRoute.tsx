import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppShell } from "./AppShell";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center text-sm"
        style={{ background: "var(--sf-bg)", color: "var(--sf-ink-soft)" }}
      >
        Carregando...
      </div>
    );
  }

  if (!user) return <Navigate to="/entrar" replace />;

  return <AppShell>{children}</AppShell>;
}
