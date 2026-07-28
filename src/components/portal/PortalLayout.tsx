import { Navigate, Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "@/hooks/data/useAuth";
import { Loader2, LogOut, LayoutDashboard, Box, History, Layers, MoreVertical, UserCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import NotificationBell from "@/components/layout/NotificationBell";
import VerticeLogo from "@/components/layout/VerticeLogo";
import FloatingChat from "@/components/chat/FloatingChat";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { Iniciais, Rotulo } from "@/components/sistema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PortalLayout() {
  const { session, loading, signOut, displayName } = useAuth();
  const { theme, setTheme } = useTheme();

  // Se estiver carregando a sessão, mostra um loader sóbrio
  if (loading) {
    return (
      <div className="sys flex min-h-screen flex-col items-center justify-center bg-sys-paper">
        <Loader2 className="mb-4 h-6 w-6 animate-spin text-sys-accent" />
        <Rotulo>Iniciando sessão</Rotulo>
      </div>
    );
  }

  // Se não estiver logado, redireciona pro login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="sys sys-prancha flex min-h-screen font-sans text-sys-ink">
      {/* Sidebar — separada do conteúdo por uma régua, não por sombra ou blur. */}
      <aside className="sticky top-0 z-40 hidden h-screen flex-col border-r border-sys-rule bg-sys-paper lg:flex lg:w-64">
        <div className="flex h-20 items-center justify-between border-b border-sys-rule px-6">
          <div className="flex min-w-0 items-center">
            <VerticeLogo className="h-8 w-8 shrink-0" />
            <div className="ml-3 min-w-0">
              <p className="truncate font-sans text-[15px] font-extrabold uppercase leading-none tracking-tight text-sys-ink">
                Vebram
              </p>
              <p className="mt-1">
                <Rotulo>Portal do cliente</Rotulo>
              </p>
            </div>
          </div>
          <NotificationBell align="left" />
        </div>

        <nav className="flex flex-col gap-0.5 px-3 py-6">
          <p className="mb-2 border-b border-sys-rule px-3 pb-1.5">
            <Rotulo>01 / Seu projeto</Rotulo>
          </p>
          <NavItem icon={<LayoutDashboard size={17} />} label="Dashboard" to="/portal" end />
          <NavItem icon={<Box size={17} />} label="Modelo BIM" to="/portal/bim" />
          <NavItem icon={<History size={17} />} label="Atualizações" to="/portal/updates" />
          <NavItem icon={<Layers size={17} />} label="Pranchas" to="/portal/pranchas" />
        </nav>

        <div className="mt-auto">
          {/* Chave de tema */}
          <div className="border-t border-sys-rule p-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex w-full items-center gap-3 rounded-sys px-3 py-2.5 transition-colors duration-150 hover:bg-sys-ink/[0.05]"
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

          {/* Bloco do usuário — toda a linha abre o menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group flex w-full items-center justify-between gap-3 border-t border-sys-rule p-4 transition-colors duration-150 hover:bg-sys-ink/[0.05]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Iniciais nome={displayName} className="h-10 w-10" />
                  <div className="hidden min-w-0 text-left lg:block">
                    <p className="truncate font-sans text-[13px] font-extrabold uppercase leading-tight tracking-tight text-sys-ink">
                      {displayName}
                    </p>
                    <p className="mt-0.5">
                      <Rotulo>Cliente Vebram</Rotulo>
                    </p>
                  </div>
                </div>
                <MoreVertical className="hidden h-4 w-4 shrink-0 text-sys-ink-3 transition-colors group-hover:text-sys-ink lg:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56 rounded-sys border-sys-rule-strong bg-sys-raised text-sys-ink shadow-sys">
              <DropdownMenuLabel className="sys-rotulo text-sys-ink-3">Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sys-rule" />
              <DropdownMenuItem asChild className="cursor-pointer rounded-sys text-[13px] focus:bg-sys-ink/[0.05]">
                <Link to="/portal/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
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
      </aside>

      {/* Header mobile: logo + tema (a sidebar some abaixo de lg) */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-sys-rule bg-sys-paper/95 px-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <VerticeLogo className="h-7 w-7" />
          <span className="font-sans text-[13px] font-extrabold uppercase tracking-tight text-sys-ink">
            Vebram
          </span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell align="right" />
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-sys text-sys-ink-2 transition-colors duration-150 hover:bg-sys-ink/[0.05] hover:text-sys-ink"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </header>

      {/* Área de conteúdo */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative z-10 mx-auto w-full px-3 pb-24 pt-[4.5rem] lg:p-8">
          <Outlet />
        </div>
      </main>

      <MobileTabBar
        tabs={[
          { icon: <LayoutDashboard size={19} />, label: "Início", to: "/portal", end: true },
          { icon: <Box size={19} />, label: "BIM", to: "/portal/bim" },
          { icon: <History size={19} />, label: "Novidades", to: "/portal/updates" },
          { icon: <Layers size={19} />, label: "Pranchas", to: "/portal/pranchas" },
          { icon: <UserCircle size={19} />, label: "Perfil", to: "/portal/profile" },
        ]}
      />

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
        `group relative flex w-full items-center gap-3 rounded-sys py-2.5 pl-4 pr-3 transition-colors duration-150 ${
          isActive
            ? "bg-sys-accent/[0.10] text-sys-ink"
            : "text-sys-ink-2 hover:bg-sys-ink/[0.05] hover:text-sys-ink"
        }`
      }
    >
      {({ isActive }) => (
        <>
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
