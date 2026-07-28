import { NavLink } from "react-router-dom";

export interface MobileTab {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
}

// Barra de abas fixa inferior, visível só abaixo de lg (a sidebar assume no desktop).
// Renderizada dentro do `.sys` dos dois layouts, então usa os tokens do sistema.
export default function MobileTabBar({ tabs }: { tabs: MobileTab[] }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sys-rule bg-sys-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="flex h-16">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                isActive ? "text-sys-accent" : "text-sys-ink-3"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Cota de aba ativa: régua no topo. Cor sozinha não pode carregar
                    o estado — em tela de celular sob sol de obra ela some. */}
                <span
                  className={`absolute inset-x-4 top-0 h-[2px] bg-sys-accent transition-opacity duration-150 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                {tab.icon}
                <span className="sys-rotulo leading-none text-current">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
