import { Link } from "react-router-dom";
import logo from "@/assets/logo-vertice.png";

const Footer = () => (
  <footer className="bg-navy-dark px-6 py-16">
    <div className="container-tight">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <img src={logo} alt="Vértice" className="h-12 w-auto brightness-0 invert mb-4" />
          <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-xs">
            Projetos residenciais com técnica, clareza e segurança. Belo Horizonte e região.
          </p>
        </div>
        <div>
          <h4 className="text-primary-foreground font-bold mb-4">Navegação</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "Home", href: "/" },
              { label: "Sobre", href: "/sobre" },
              { label: "Serviços", href: "/servicos" },
              { label: "Projetos", href: "/projetos" },
              { label: "Orçamento", href: "/orcamento" },
              { label: "Contato", href: "/contato" },
            ].map((l) => (
              <Link key={l.href} to={l.href} className="text-primary-foreground/50 text-sm hover:text-accent transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-primary-foreground font-bold mb-4">Contato</h4>
          <div className="flex flex-col gap-2 text-primary-foreground/50 text-sm">
            <span>(31) 98598-1606</span>
            <span>verticeprojetos7@gmail.com</span>
            <span>@projetos.vertice</span>
            <span>Belo Horizonte — MG</span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-primary-foreground/30 text-sm">
        © {new Date().getFullYear()} Vértice Projetos. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
