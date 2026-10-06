export type JobStatus =
  | "Novo"
  | "Agendado"
  | "Em Execução"
  | "Concluído"
  | "Cancelado";

export interface User {
  id: number;
  company_id: number;
  name: string;
  email: string;
  role: "owner" | "admin" | "technician";
}

export interface Client {
  id: number;
  company_id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
}

export interface Job {
  id: number;
  company_id: number;
  client_id: number;
  title: string;
  status: JobStatus;
  value: number;
  scheduled_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface DashboardStats {
  clients: number;
  open_jobs: number;
  revenue: number;
  pipeline: number;
}
