import { Navigate, Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/data/useAuth";
import { Loader2, LogOut, LayoutDashboard, Briefcase, Users, Search, Settings, Sun, Moon, UserCircle, Plus, UserPlus, ArrowRight, Command, Rss, CalendarDays, BarChart3, Gauge, Contact, KanbanSquare, ListChecks, SlidersHorizontal, BookOpen, X } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import NotificationBell from "@/components/layout/NotificationBell";
import VerticeLogo from "@/components/layout/VerticeLogo";
import FloatingChat from "@/components/chat/FloatingChat";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { Iniciais, Rotulo } from "@/components/sistema";
import { LightboxProvider } from "@/components/hq/thevertice/shared";
import { CrmCompanyProvider } from "@/hooks/data/useCrmCompany";
import CompanySwitcher from "@/components/hq/crm/CompanySwitcher";
import CrmGuideDrawer from "@/components/hq/crm/CrmGuideDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ── Command palette ───────────────────────────────────────────────────────────

interface Cmd {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  path: string;
  category: string;
  keywords: string[];
}

const COMMANDS: Cmd[] = [
  { id: "dashboard",   label: "Dashboard",      desc: "Área principal do sistema",       icon: LayoutDashboard, path: "/hq",              category: "Navegar",  keywords: ["home","início","inicio","painel","principal","dashboard"] },
  { id: "projects",    label: "Ver Projetos",    desc: "Lista de todos os projetos",      icon: Briefcase,       path: "/hq/projects",     category: "Navegar",  keywords: ["projetos","obras","ver projetos","listar"] },
  { id: "clients",     label: "Ver Clientes",    desc: "Lista de todos os clientes",      icon: Users,           path: "/hq/clients",      category: "Navegar",  keywords: ["clientes","contatos","empresa","ver clientes"] },
  { id: "feed",        label: "Mural",           desc: "Feed interno da equipe",          icon: Rss,             path: "/hq/feed",         category: "VEBRAM", keywords: ["mural","feed","publicações","publicacoes","posts","vebram"] },
  { id: "calendar",    label: "Calendário",      desc: "Disponibilidade da equipe",       icon: CalendarDays,    path: "/hq/calendar",     category: "VEBRAM", keywords: ["calendário","calendario","agenda","disponibilidade","férias","ferias","vebram"] },
  { id: "polls",       label: "Enquetes",        desc: "Decisões e votações da equipe",    icon: BarChart3,       path: "/hq/polls",        category: "VEBRAM", keywords: ["enquetes","votação","votacao","poll","decisões","decisoes","vebram"] },
  { id: "members",     label: "Membros",         desc: "Sócios e equipe da rede",         icon: Users,           path: "/hq/members",      category: "VEBRAM", keywords: ["membros","equipe","sócios","socios","time","members","vebram"] },
  { id: "profile",     label: "Meu Perfil",      desc: "Configurações da sua conta",      icon: UserCircle,      path: "/hq/profile",      category: "Navegar",  keywords: ["perfil","conta","configurações","settings","profile"] },
  { id: "new-project", label: "Criar Projeto",   desc: "Abrir formulário de novo projeto",icon: Plus,            path: "/hq/projects?new=1", category: "Ações",  keywords: ["criar projeto","novo projeto","adicionar projeto","new project","add project"] },
  { id: "new-client",  label: "Criar Cliente",   desc: "Cadastrar um novo cliente",       icon: UserPlus,        path: "/hq/clients?new=1",  category: "Ações",  keywords: ["criar cliente","novo cliente","adicionar cliente","cadastrar cliente","new client"] },
  { id: "crm",          label: "CRM",             desc: "Painel do CRM",                   icon: Gauge,             path: "/hq/crm",          category: "CRM", keywords: ["crm","funil","vendas","pipeline","leads","painel crm"] },
  { id: "crm-leads",    label: "Leads",           desc: "Clientes e leads do CRM",         icon: Contact,           path: "/hq/crm/leads",    category: "CRM", keywords: ["leads","clientes","prospecção","prospeccao","contatos crm"] },
  { id: "crm-pipeline", label: "Pipeline",        desc: "Funil de vendas (Kanban)",        icon: KanbanSquare,      path: "/hq/crm/pipeline", category: "CRM", keywords: ["pipeline","funil","kanban","etapas","negócios","negocios"] },
  { id: "crm-tasks",    label: "Tarefas do CRM",  desc: "Follow-ups e próximas ações",     icon: ListChecks,        path: "/hq/crm/tasks",    category: "CRM", keywords: ["tarefas","follow-up","followup","próximas ações","proximas acoes","lembretes"] },
  { id: "crm-settings", label: "Config. do CRM",  desc: "Etapas e regras de automação",    icon: SlidersHorizontal, path: "/hq/crm/settings", category: "CRM", keywords: ["configurações crm","configuracoes crm","etapas","regras","automação","automacao"] },
];

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function filterCommands(q: string): Cmd[] {
  if (!q.trim()) return COMMANDS;
  const n = normalize(q);
  return COMMANDS.filter(c =>
    normalize(c.label).includes(n) ||
    normalize(c.desc).includes(n) ||
    c.keywords.some(k => normalize(k).includes(n))
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = filterCommands(query);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setActiveIdx(0); }, [query]);

  const execute = useCallback((cmd: Cmd) => {
    navigate(cmd.path);
    onClose();
  }, [navigate, onClose]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && results[activeIdx]) execute(results[activeIdx]);
    else if (e.key === "Escape") onClose();
  }

  const categories = [...new Set(results.map(c => c.category))];

  return (
    // Sombra e superfície elevada são legítimas aqui: há empilhamento real.
    <div className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-sys border border-sys-rule-strong bg-sys-raised shadow-sys">
      <div className="flex items-center gap-3 border-b border-sys-rule px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-sys-ink-3" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Buscar ou digitar um comando..."
          className="flex-1 bg-transparent text-[13px] text-sys-ink outline-none placeholder:text-sys-ink-3"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Limpar busca" className="text-sys-ink-3 transition-colors hover:text-sys-ink">
            <X size={14} />
          </button>
        )}
        <kbd className="sys-rotulo hidden shrink-0 rounded-sys border border-sys-rule px-1.5 py-1 text-sys-ink-3 sm:block">ESC</kbd>
      </div>

      <div className="max-h-80 overflow-y-auto py-2">
        {results.length === 0 && (
          <p className="py-6 text-center text-[13px] text-sys-ink-3">Nenhum resultado para "{query}"</p>
        )}
        {categories.map(cat => (
          <div key={cat}>
            <p className="px-4 pb-1.5 pt-3">
              <Rotulo>{cat}</Rotulo>
            </p>
            {results.filter(c => c.category === cat).map(cmd => {
              const idx = results.indexOf(cmd);
              const Icon = cmd.icon;
              const isActive = idx === activeIdx;
              return (
                <button
                  key={cmd.id}
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 ${
                    isActive ? "bg-sys-accent/[0.08]" : "hover:bg-sys-ink/[0.04]"
                  }`}
                >
                  {/* Cota de seleção: uma régua na margem, no lugar do preenchimento azul. */}
                  <span className={`absolute inset-y-0 left-0 w-[2px] bg-sys-accent transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0"}`} />
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sys border transition-colors duration-150 ${
                    isActive
                      ? "border-sys-accent/40 bg-sys-accent/10 text-sys-accent"
                      : "border-sys-rule text-sys-ink-3"
                  }`}>
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-[13px] font-semibold ${isActive ? "text-sys-accent" : "text-sys-ink"}`}>
                      {cmd.label}
                    </span>
                    <span className="block truncate text-[13px] text-sys-ink-3">{cmd.desc}</span>
                  </span>
                  <ArrowRight size={13} className={`shrink-0 text-sys-accent transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0"}`} />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-4 border-t border-sys-rule px-4 py-2">
        <Rotulo>↑↓ navegar</Rotulo>
        <Rotulo>↵ executar</Rotulo>
        <Rotulo>ESC fechar</Rotulo>
      </div>
    </div>
  );
}

export default function HqLayout() {
  const { session, loading, isAdmin, signOut, displayName } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [showPalette, setShowPalette] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) setShowPalette(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowPalette(v => !v); }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  if (loading) {
    return (
      <div className="sys flex min-h-screen flex-col items-center justify-center bg-sys-paper">
        <Loader2 className="mb-4 h-6 w-6 animate-spin text-sys-accent" />
        <Rotulo>Iniciando sessão QG</Rotulo>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Acesso ao HQ é decidido pelo CARGO (profiles.role), não pelo texto do e-mail.
  if (!isAdmin) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <CrmCompanyProvider>
    <div className="sys sys-prancha flex min-h-screen font-sans text-sys-ink">

      {/* Sidebar — carimbo da prancha: separada por uma régua, não por sombra. */}
      <aside className="sticky top-0 z-40 hidden h-screen flex-col border-r border-sys-rule bg-sys-paper lg:flex lg:w-[260px]">

        <div className="flex h-24 items-center border-b border-sys-rule px-6">
          <VerticeLogo className="h-8 w-8 shrink-0" />
          <div className="ml-3 min-w-0">
            <p className="font-sans text-[15px] font-extrabold uppercase leading-none tracking-tight text-sys-ink">
              Vebram
            </p>
            <p className="mt-1">
              <Rotulo>Quartel-general</Rotulo>
            </p>
          </div>
        </div>

        <nav className="scrollbar-none flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-5">
          <GrupoNav n="01" titulo="Menu principal" />
          <NavItem icon={<LayoutDashboard size={17} />} label="Dashboard" to="/hq" end />
          <NavItem icon={<Briefcase size={17} />} label="Projetos" to="/hq/projects" />
          <NavItem icon={<Users size={17} />} label="Clientes" to="/hq/clients" />

          <GrupoNav n="02" titulo="Vebram" />
          <NavItem icon={<Rss size={17} />} label="Mural" to="/hq/feed" />
          <NavItem icon={<CalendarDays size={17} />} label="Calendário" to="/hq/calendar" />
          <NavItem icon={<BarChart3 size={17} />} label="Enquetes" to="/hq/polls" />
          <NavItem icon={<Users size={17} />} label="Membros" to="/hq/members" />

          <GrupoNav n="03" titulo="CRM" />
          <NavItem icon={<Gauge size={17} />} label="Painel CRM" to="/hq/crm" end />
          <NavItem icon={<Contact size={17} />} label="Leads" to="/hq/crm/leads" />
          <NavItem icon={<KanbanSquare size={17} />} label="Pipeline" to="/hq/crm/pipeline" />
          <NavItem icon={<ListChecks size={17} />} label="Tarefas" to="/hq/crm/tasks" />
          <NavItem icon={<SlidersHorizontal size={17} />} label="Config" to="/hq/crm/settings" />
        </nav>

        {/* Chave de tema — interruptor reto, com a posição legível de longe. */}
        <div className="mt-auto border-t border-sys-rule p-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="group flex w-full items-center gap-3 rounded-sys px-3 py-2.5 transition-colors duration-150 hover:bg-sys-ink/[0.05]"
            aria-label={`Alternar para tema ${theme === "dark" ? "claro" : "escuro"}`}
          >
            <span className="relative flex h-6 w-11 shrink-0 items-center rounded-sys border border-sys-rule-strong bg-sys-ink/[0.04]">
              <span
                className={`absolute flex h-[18px] w-[18px] items-center justify-center bg-sys-accent text-white transition-transform duration-150 ease-out ${
                  theme === "dark" ? "translate-x-[22px]" : "translate-x-[2px]"
                }`}
              >
                {theme === "dark" ? <Moon size={11} /> : <Sun size={11} />}
              </span>
            </span>
            <Rotulo className="text-sys-ink-2">Tema {theme === "dark" ? "escuro" : "claro"}</Rotulo>
          </button>
        </div>
      </aside>

      {/* Área de conteúdo */}
      <main className="flex flex-1 flex-col overflow-y-auto">

        {/* Carimbo superior */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-sys-rule bg-sys-paper/90 px-3 backdrop-blur-md lg:h-24 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Iniciais nome={displayName} className="h-9 w-9 lg:h-10 lg:w-10" />
            <div className="min-w-0">
              <h2 className="truncate font-sans text-[13px] font-extrabold uppercase leading-tight tracking-tight text-sys-ink">
                {displayName}
              </h2>
              <p className="hidden lg:block">
                <Rotulo>
                  {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                </Rotulo>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {location.pathname.startsWith("/hq/crm") && (
              <>
                <CompanySwitcher />
                <button
                  onClick={() => setShowGuide(true)}
                  className="flex shrink-0 items-center gap-1.5 rounded-sys border border-sys-rule-strong px-3 py-2 text-sys-ink-2 transition-colors duration-150 hover:bg-sys-ink/[0.05] hover:text-sys-ink"
                >
                  <BookOpen size={13} />
                  <Rotulo className="hidden text-inherit sm:inline">Guia do CRM</Rotulo>
                </button>
              </>
            )}

            {/* Gatilho do command palette */}
            <div ref={paletteRef} className="relative hidden md:block">
              <button
                onClick={() => setShowPalette(v => !v)}
                className="flex w-64 items-center gap-2.5 rounded-sys border border-sys-rule-strong px-3 py-2.5 text-left transition-colors duration-150 hover:border-sys-accent"
              >
                <Search className="h-4 w-4 shrink-0 text-sys-ink-3" />
                <span className="flex-1 truncate text-[13px] text-sys-ink-3">Buscar projetos, clientes...</span>
                <kbd className="sys-rotulo flex shrink-0 items-center gap-0.5 rounded-sys border border-sys-rule px-1.5 py-0.5 text-sys-ink-3">
                  <Command size={9} />K
                </kbd>
              </button>
              {showPalette && <CommandPalette onClose={() => setShowPalette(false)} />}
            </div>

            <NotificationBell align="right" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Configurações da conta"
                  className="flex h-10 w-10 items-center justify-center rounded-sys border border-sys-rule-strong text-sys-ink-2 transition-colors duration-150 hover:bg-sys-ink/[0.05] hover:text-sys-ink"
                >
                  <Settings size={17} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-sys border-sys-rule-strong bg-sys-raised text-sys-ink shadow-sys">
                <DropdownMenuLabel className="sys-rotulo text-sys-ink-3">Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-sys-rule" />
                <DropdownMenuItem asChild className="cursor-pointer rounded-sys text-[13px] focus:bg-sys-ink/[0.05]">
                  <Link to="/hq/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Meu perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sys-rule" />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer rounded-sys text-[13px] text-sys-danger focus:bg-sys-danger/[0.08] focus:text-sys-danger">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair do sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 px-3 py-5 pb-24 lg:p-8">
          <LightboxProvider>
            <Outlet />
          </LightboxProvider>
        </div>
      </main>

      <MobileTabBar
        tabs={[
          { icon: <LayoutDashboard size={19} />, label: "Painel", to: "/hq", end: true },
          { icon: <Rss size={19} />, label: "Mural", to: "/hq/feed" },
          { icon: <CalendarDays size={19} />, label: "Agenda", to: "/hq/calendar" },
          { icon: <BarChart3 size={19} />, label: "Enquetes", to: "/hq/polls" },
          { icon: <Gauge size={19} />, label: "CRM", to: "/hq/crm", end: true },
        ]}
      />

      <FloatingChat />
      <CrmGuideDrawer isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
    </CrmCompanyProvider>
  );
}

/** Cabeçalho de grupo da navegação — numerado, como as pranchas de um caderno. */
function GrupoNav({ n, titulo }: { n: string; titulo: string }) {
  return (
    <p className="mb-2 mt-5 flex items-baseline gap-2 border-b border-sys-rule px-3 pb-1.5 first:mt-0">
      <Rotulo>{n} /</Rotulo>
      <Rotulo className="text-sys-ink-2">{titulo}</Rotulo>
    </p>
  );
}

function NavItem({ icon, label, to, end }: { icon: React.ReactNode; label: string; to: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative flex w-full items-center gap-3 rounded-sys py-2.5 pl-4 pr-3 transition-colors duration-150 ${
          isActive
            ? "bg-sys-accent/[0.10] text-sys-ink"
            : "text-sys-ink-2 hover:bg-sys-ink/[0.05] hover:text-sys-ink"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* A marcação do item ativo é uma cota na margem — não uma pílula azul. */}
          <span
            className={`absolute inset-y-1 left-0 w-[2px] bg-sys-accent transition-opacity duration-150 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <span className={isActive ? "text-sys-accent" : ""}>{icon}</span>
          <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
        </>
      )}
    </NavLink>
  );
}
