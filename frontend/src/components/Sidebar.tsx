import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/clientes", label: "Clientes" },
  { to: "/ordens", label: "Ordens de serviço" },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside
      className="flex h-full w-60 shrink-0 flex-col justify-between border-r px-4 py-5"
      style={{ borderColor: "var(--sf-line)", background: "var(--sf-surface)" }}
    >
      <div>
        <div className="mb-8 px-1">
          <p
            className="text-lg font-medium tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--sf-ink)" }}
          >
            ServiFlow
          </p>
          <p className="mt-0.5 truncate text-sm" style={{ color: "var(--sf-ink-soft)" }}>
            {user ? `Empresa #${user.company_id}` : "carregando..."}
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-md border-l-2 px-3 py-2 text-sm transition-colors ${
                  isActive ? "font-medium" : "border-transparent"
                }`
              }
              style={({ isActive }) => ({
                borderLeftColor: isActive ? "var(--sf-teal)" : "transparent",
                background: isActive ? "var(--sf-teal-tint)" : "transparent",
                color: isActive ? "var(--sf-teal-dark)" : "var(--sf-ink-soft)",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t pt-4" style={{ borderColor: "var(--sf-line)" }}>
        <p className="truncate px-1 text-sm font-medium" style={{ color: "var(--sf-ink)" }}>
          {user?.name}
        </p>
        <p className="truncate px-1 text-xs" style={{ color: "var(--sf-ink-soft)" }}>
          {user?.email}
        </p>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-md border px-3 py-1.5 text-left text-sm transition-colors hover:opacity-80"
          style={{ borderColor: "var(--sf-line)", color: "var(--sf-ink-soft)" }}
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
