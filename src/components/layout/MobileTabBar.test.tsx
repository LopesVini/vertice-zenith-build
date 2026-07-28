// src/components/layout/MobileTabBar.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { LayoutDashboard, Box, History } from "lucide-react";
import MobileTabBar, { MobileTab } from "@/components/layout/MobileTabBar";

const tabs: MobileTab[] = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", to: "/portal", end: true },
  { icon: <Box size={20} />, label: "BIM", to: "/portal/bim" },
  { icon: <History size={20} />, label: "Atualizações", to: "/portal/updates" },
];

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <MobileTabBar tabs={tabs} />
    </MemoryRouter>
  );
}

describe("MobileTabBar", () => {
  it("renderiza todas as abas com label e link", () => {
    renderAt("/portal");
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/portal");
    expect(screen.getByRole("link", { name: /bim/i })).toHaveAttribute("href", "/portal/bim");
    expect(screen.getByRole("link", { name: /atualizações/i })).toHaveAttribute("href", "/portal/updates");
  });

  it("marca a aba ativa com o acento do sistema", () => {
    renderAt("/portal/bim");
    const ativa = screen.getByRole("link", { name: /bim/i });
    // aria-current é o que realmente comunica o estado (leitores de tela);
    // o token de cor é só o reforço visual dele.
    expect(ativa).toHaveAttribute("aria-current", "page");
    expect(ativa.className).toContain("text-sys-accent");
    expect(screen.getByRole("link", { name: /dashboard/i }).className).not.toContain("text-sys-accent");
  });

  it("aba Dashboard com end não fica ativa em sub-rotas", () => {
    renderAt("/portal/updates");
    const dashboard = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboard).not.toHaveAttribute("aria-current");
    expect(dashboard.className).not.toContain("text-sys-accent");
  });
});
