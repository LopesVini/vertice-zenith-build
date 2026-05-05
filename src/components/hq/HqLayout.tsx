import { Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, LogOut, LayoutDashboard, Briefcase, Users, Search, Bell, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import FloatingChat from "@/components/chat/FloatingChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HqLayout() {
  const { session, loading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

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
          <div className="w-8 h-8 bg-navy dark:bg-primary rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-black text-lg">V</span>
          </div>
          <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight text-navy dark:text-white">
            VerticeHQ
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
              <h2 className="text-sm font-bold text-navy dark:text-white leading-tight">Olá, {session.user.email?.split("@")[0].toUpperCase() || "ADMIN"}</h2>
              <p className="text-xs text-zinc-500">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Buscar projetos, clientes..." 
                className="w-64 bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-navy dark:text-white focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>
            
            <button className="w-10 h-10 bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-navy dark:hover:text-white transition-colors shadow-sm relative">
              <Bell size={18} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-navy-dark"></div>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-navy dark:hover:text-white transition-colors shadow-sm">
                  <Settings size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-navy border-zinc-200 dark:border-white/10 text-navy dark:text-white rounded-xl shadow-2xl">
                <DropdownMenuLabel className="font-mono text-xs text-zinc-500">Configurações</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-200 dark:bg-white/10" />
                <DropdownMenuItem className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">
                  Meu Perfil
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
