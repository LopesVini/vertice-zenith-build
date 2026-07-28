import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/data/useAuth";
import { fetchRole, isAdminRole } from "@/lib/roles";
import { useToast } from "@/hooks/ui/use-toast";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import VerticeLogo from "@/components/layout/VerticeLogo";
import { Botao, Campo, Rotulo } from "@/components/sistema";

export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redireciona pelo CARGO (profiles.role), já resolvido pelo useAuth.
    if (!loading && session) {
      navigate(isAdmin ? "/hq" : "/portal", { replace: true });
    }
  }, [session, isAdmin, loading, navigate]);

  if (session) {
    return null; // Return null while navigating to avoid showing the login form
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Acesso negado",
          description: "Credenciais inválidas. Verifique seu e-mail e senha.",
          variant: "destructive",
        });
      } else if (data.session) {
        const role = await fetchRole(data.session.user.id);
        const admin = isAdminRole(role);
        toast({
          title: "Autenticado com sucesso",
          description: admin ? "Bem-vindo ao VEBRAM QG." : "Bem-vindo à Área do Cliente VEBRAM.",
        });
        navigate(admin ? "/hq" : "/portal");
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sys flex min-h-screen w-full bg-sys-paper font-sans text-sys-ink">

      {/* ── Folha de acesso ──────────────────────────────────────────────────*/}
      <div className="flex w-full flex-col p-8 lg:w-[45%] lg:p-16">

        <Link to="/" className="mb-16 flex items-center gap-3 transition-opacity hover:opacity-70">
          <VerticeLogo className="h-10 w-10 shrink-0" />
          <div>
            <p className="font-sans text-[15px] font-extrabold uppercase leading-none tracking-tight">
              Vebram
            </p>
            <p className="mt-1">
              <Rotulo>Engenharia · RMBH</Rotulo>
            </p>
          </div>
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p className="mb-3 border-b border-sys-rule-strong pb-1.5">
              <Rotulo>00 / Autenticação</Rotulo>
            </p>
            <h1 className="text-[28px] font-extrabold uppercase leading-none tracking-tight">
              Acesso ao portal
            </h1>
            <p className="mb-10 mt-3 text-[15px] leading-relaxed text-sys-ink-2">
              Entre com suas credenciais para acompanhar a evolução da sua obra.
            </p>

            <form onSubmit={handleLogin} className="space-y-7">
              <Campo
                id="email"
                rotulo="E-mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com.br"
                required
              />

              <Campo
                id="password"
                rotulo="Senha"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Botao
                type="submit"
                variante="primario"
                carregando={isLoading}
                className="group w-full"
              >
                {isLoading ? "Autenticando..." : "Acessar portal"}
                {!isLoading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                )}
              </Botao>
            </form>

            <p className="mt-10 border-t border-sys-rule pt-5 text-[13px] text-sys-ink-2">
              Não possui credenciais?{" "}
              <a href="/contato" className="font-semibold text-sys-accent hover:underline">
                Solicite o acesso ao seu gestor
              </a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Prancha ──────────────────────────────────────────────────────────
          Nada aqui finge ser dado. O painel antigo mostrava um gráfico de
          mentira e três cards flutuantes; no lugar entra o que a Vebram
          realmente entrega: uma prancha, com sua grade e seu carimbo.        */}
      <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden border-l border-white/10 bg-[#0B1420] p-12 text-white lg:flex">

        {/* Grade milimetrada, desenhada e não decorada */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,.05) 0 1px, transparent 1px 48px), repeating-linear-gradient(to bottom, rgba(255,255,255,.05) 0 1px, transparent 1px 48px)",
          }}
        />

        <div className="relative">
          <p className="sys-rotulo text-white/40">Portal do cliente</p>
        </div>

        {/* O eco do hero institucional — o único Playfair da tela */}
        <div className="relative max-w-xl">
          <h2 className="font-sans text-[28px] font-extrabold uppercase leading-none tracking-tight text-white/90">
            Acompanhe sua obra com
          </h2>
          <p className="mt-1 font-drama text-[88px] italic leading-[0.85] text-[#4B9FD5]">
            Precisão.
          </p>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/60">
            Marcos, pranchas, atualizações e o modelo BIM da sua obra — tudo em um
            lugar só, atualizado por quem está tocando o projeto.
          </p>
        </div>

        {/* Carimbo, como em toda prancha de projeto */}
        <div className="relative">
          <div className="flex items-stretch border border-white/15">
            <div className="flex items-center gap-3 border-r border-white/15 px-5 py-4">
              <VerticeLogo monoWhite className="h-9 w-9" />
              <span className="font-sans text-[13px] font-extrabold uppercase tracking-tight">
                Vebram
              </span>
            </div>
            <CampoCarimbo rotulo="Disciplina" valor="Portal" />
            <CampoCarimbo rotulo="Região" valor="RMBH · MG" />
            <CampoCarimbo rotulo="Folha" valor="01/01" ultimo />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Célula do carimbo: rótulo em cima, valor embaixo — como no bloco de título. */
function CampoCarimbo({ rotulo, valor, ultimo }: { rotulo: string; valor: string; ultimo?: boolean }) {
  return (
    <div className={`flex flex-col justify-center px-5 py-4 ${ultimo ? "" : "border-r border-white/15"}`}>
      <span className="sys-rotulo text-white/40">{rotulo}</span>
      <span className="mt-1.5 font-mono text-[11px] tracking-tecnico text-white/80">{valor}</span>
    </div>
  );
}
