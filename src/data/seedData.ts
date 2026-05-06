import type { Project } from "@/hooks/useProjects";

// Dados de fachada — aparecem na UI para dar uma cara apresentável enquanto
// não há projetos/clientes reais suficientes no banco.

export const SEED_PROJECTS: Project[] = [
  {
    id: "seed-1",
    name: "Residencial Alphaville",
    client_id: null,
    type: "Projeto Executivo Completo",
    status: "Em Andamento",
    progress: 51,
    priority: "Alta",
    color: "bg-blue-500",
    team: ["Carlos", "Marina", "Ana"],
    start_date: "2026-01-10",
    end_date: "2026-08-17",
    description: "Residência unifamiliar de alto padrão em condomínio fechado.",
    created_at: "2026-01-10T00:00:00Z",
    client: { display_name: "Lucas Rodrigues", email: "lucas@rodrigues.com" },
  },
  {
    id: "seed-2",
    name: "Edifício Comercial Zenith",
    client_id: null,
    type: "Arquitetura e Interiores",
    status: "Em Andamento",
    progress: 89,
    priority: "Alta",
    color: "bg-green-500",
    team: ["Rafael", "Lívia"],
    start_date: "2025-11-01",
    end_date: "2026-08-15",
    description: "Torre comercial de 12 andares com fachada em vidro estrutural.",
    created_at: "2025-11-01T00:00:00Z",
    client: { display_name: "Zenith Incorporações", email: "dir@zenith.com.br" },
  },
  {
    id: "seed-3",
    name: "Galpão Logístico Sul",
    client_id: null,
    type: "Estrutural e Fundações",
    status: "Em Andamento",
    progress: 32,
    priority: "Média",
    color: "bg-red-500",
    team: ["Carlos", "Thiago", "Felipe", "Eduardo"],
    start_date: "2026-02-01",
    end_date: "2026-09-02",
    description: "Galpão de 8.000 m² para operações logísticas em Betim-MG.",
    created_at: "2026-02-01T00:00:00Z",
    client: { display_name: "LogSul Ltda.", email: "ops@logsul.com.br" },
  },
  {
    id: "seed-4",
    name: "Villa Nova — Casa de Campo",
    client_id: null,
    type: "Arquitetura + Interiores",
    status: "Revisão",
    progress: 70,
    priority: "Média",
    color: "bg-amber-500",
    team: ["Ana", "Mariana"],
    start_date: "2026-03-15",
    end_date: "2026-10-01",
    description: "Casa de campo com integração paisagística e piscina natural.",
    created_at: "2026-03-15T00:00:00Z",
    client: { display_name: "João Mendes", email: "joao.mendes@gmail.com" },
  },
  {
    id: "seed-5",
    name: "Clínica Saúde Total",
    client_id: null,
    type: "Projeto Completo — Saúde",
    status: "Concluído",
    progress: 100,
    priority: "Alta",
    color: "bg-violet-500",
    team: ["Rafael", "Carlos"],
    start_date: "2025-06-01",
    end_date: "2026-04-30",
    description: "Reforma e ampliação de clínica médica multidisciplinar.",
    created_at: "2025-06-01T00:00:00Z",
    client: { display_name: "Dr. Fernando Lima", email: "flima@saudetotal.com" },
  },
];

export interface SeedClient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: "Ativo" | "Em Pausa" | "Concluído";
  projects: number;
  since: string;
  vip: boolean;
  initials: string;
  color: string;
}

export const SEED_CLIENTS: SeedClient[] = [
  { id: "sc-1", name: "Lucas Rodrigues",      company: "Fam. Rodrigues",      email: "lucas@rodrigues.com",    phone: "31 99812-4455", city: "BH",        status: "Ativo",     projects: 1, since: "Jan 2026", vip: true,  initials: "LR", color: "bg-blue-500"   },
  { id: "sc-2", name: "Zenith Incorporações",  company: "Zenith Incorp.",       email: "dir@zenith.com.br",      phone: "31 3344-1100", city: "Contagem",  status: "Ativo",     projects: 1, since: "Nov 2025", vip: true,  initials: "ZI", color: "bg-violet-500" },
  { id: "sc-3", name: "LogSul Ltda.",           company: "LogSul",               email: "ops@logsul.com.br",      phone: "31 3255-8800", city: "Betim",     status: "Ativo",     projects: 1, since: "Fev 2026", vip: false, initials: "LS", color: "bg-orange-500" },
  { id: "sc-4", name: "João Mendes",            company: "Particular",           email: "joao.mendes@gmail.com",  phone: "31 98874-3321",city: "Nova Lima", status: "Ativo",     projects: 1, since: "Mar 2026", vip: false, initials: "JM", color: "bg-teal-500"   },
  { id: "sc-5", name: "Dr. Fernando Lima",     company: "Clínica Saúde Total",  email: "flima@saudetotal.com",   phone: "31 99453-7710",city: "BH",        status: "Concluído", projects: 1, since: "Jun 2025", vip: false, initials: "FL", color: "bg-rose-500"   },
  { id: "sc-6", name: "PV Empreendimentos",    company: "Parque Verde",          email: "dir@parqueverde.com.br", phone: "31 3410-0052", city: "Ribeirão",  status: "Em Pausa",  projects: 1, since: "Dez 2025", vip: false, initials: "PV", color: "bg-cyan-500"   },
  { id: "sc-7", name: "TechBR S.A.",            company: "TechBR",               email: "projetos@techbr.com",    phone: "31 3500-9900", city: "BH",        status: "Concluído", projects: 1, since: "Jun 2025", vip: true,  initials: "TB", color: "bg-slate-500"  },
  { id: "sc-8", name: "Fam. Carvalho",          company: "Particular",           email: "ana.carvalho@gmail.com", phone: "31 97765-1122",city: "Sarzedo",   status: "Concluído", projects: 1, since: "Mai 2025", vip: false, initials: "FC", color: "bg-pink-500"   },
];
