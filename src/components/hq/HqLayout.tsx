import { Navigate, Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, LogOut, LayoutDashboard, Briefcase, Users, Search, Bell, Settings, Sun, Moon, UserCircle, CheckCheck } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import VerticeLogo from "@/components/VerticeLogo";
import FloatingChat from "@/components/chat/FloatingChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Novo orçamento recebido", desc: "Cliente João Silva enviou uma solicitação de orçamento.", time: "5 min", read: false },
  { id: 2, title: "Projeto atualizado", desc: "Casa Alto da Boa Vista avançou para 78% de conclusão.", time: "1h", read: false },
  { id: 3, title: "Entrega aprovada", desc: "Prancha EP-14 aprovada pelo cliente Residência Morumbi.", time: "3h", read: true },
  { id: 4, title: "Marco concluído", desc: "Compatibilização BIM finalizada no Edifício Central Park.", time: "1d", read: true },
];

export default function HqLayout() {
  const { session, loading, signOut, displayName } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showBell, setShowBell] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const bellRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowBell(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    // Navega para projetos ou clientes dependendo do termo
    const dest = /cliente|contato|empresa/i.test(q) ? "/hq/clients" : "/hq/projects";
    navigate(dest);
    setSearch("");
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A] flex flex-col items-center justify-center transition-colors">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-zinc-500 font-mono text-sm tracking-widest animate-pulse">
          INICIANDO SESSÃO HQ...
        </p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se é admin (contém 'admin' ou '@vertice' no email)
  const isAdmin = session.user?.email?.includes('admin') || session.user?.email?.includes('@vertice');
  if (!isAdmin) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-navy-dark text-navy dark:text-white flex transition-colors duration-300 font-sans">
      
      {/* Sidebar - Reference Image Style */}
      <aside className="w-20 lg:w-[260px] bg-white dark:bg-navy-light/60 flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 border-r border-transparent dark:border-white/5 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        
        {/* Logo */}
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8">
          <VerticeLogo className="w-9 h-9 shrink-0" />
          <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight text-navy dark:text-white">
            VérticeQG
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-2 px-4">
          <p className="hidden lg:block text-xs font-bold text-zinc-400 mb-2 px-4">MAIN MENU</p>
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/hq" end />
          <NavItem icon={<Briefcase size={20} />} label="Projetos" to="/hq/projects" />
          <NavItem icon={<Users size={20} />} label="Clientes" to="/hq/clients" />
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col gap-4 p-4">
          {/* Theme Toggle - Pill Style */}
          <div className="flex items-center justify-center lg:justify-start">
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative w-14 h-8 rounded-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 transition-colors duration-300 focus:outline-none flex items-center"
              aria-label="Toggle Theme"
            >
              <div 
                className={`absolute w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 shadow-sm ${
                  theme === "dark" 
                    ? "translate-x-7 bg-navy-light text-white" 
                    : "translate-x-1 bg-white text-navy border border-zinc-200"
                }`}
              >
                {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
              </div>
            </button>
            <span className="hidden lg:block ml-3 text-sm font-medium text-zinc-500">
              Tema {theme === "dark" ? "Escuro" : "Claro"}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        
        {/* Top Header */}
        <header className="h-24 px-8 flex items-center justify-between sticky top-0 bg-[#F8FAFC]/80 dark:bg-navy-dark/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-navy dark:text-white leading-tight">Olá, {displayName}</h2>
              <p className="text-xs text-zinc-500">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar projetos, clientes..."
                className="w-64 bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-navy dark:text-white focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
              />
            </form>

            {/* Bell / Notificações */}
            <div ref={bellRef} className="relative">
              <button
                onClick={() => setShowBell((v) => !v)}
                className="w-10 h-10 bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-navy dark:hover:text-white transition-colors shadow-sm relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-navy-dark" />
                )}
              </button>

              {showBell && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-navy-light border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-white/5">
                    <span className="font-bold text-sm text-navy dark:text-white">Notificações</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-semibold">
                        <CheckCheck size={13} /> Marcar todas como lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-white/5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                        className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-white/5 ${!n.read ? "bg-blue-50/50 dark:bg-blue-500/5" : ""}`}
                      >
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? "bg-zinc-300 dark:bg-zinc-600" : "bg-blue-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${n.read ? "text-zinc-500 dark:text-zinc-400" : "text-navy dark:text-white"}`}>{n.title}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 line-clamp-2">{n.desc}</p>
                          <p className="text-[10px] text-zinc-400 mt-1">{n.time} atrás</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-navy dark:hover:text-white transition-colors shadow-sm">
                  <Settings size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-navy border-zinc-200 dark:border-white/10 text-navy dark:text-white rounded-xl shadow-2xl">
                <DropdownMenuLabel className="font-mono text-xs text-zinc-500">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-200 dark:bg-white/10" />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">
                  <Link to="/hq/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-200 dark:bg-white/10" />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-500 dark:text-red-400 hover:bg-red-500/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair do sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>

      <FloatingChat />
    </div>
  );
}

function NavItem({ icon, label, to, end }: { icon: React.ReactNode; label: string; to: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `w-full flex items-center justify-center lg:justify-start p-3 lg:px-4 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30"
            : "text-zinc-500 dark:text-zinc-400 hover:text-navy dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`${isActive ? "text-white" : ""}`}>
            {icon}
          </div>
          <span className="hidden lg:block ml-3 text-sm font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}
