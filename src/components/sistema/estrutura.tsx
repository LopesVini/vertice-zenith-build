import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Estrutura da "Prancha Técnica".

   A regra que governa tudo: a hierarquia vem de RÉGUAS e do GRID, não de caixas.
   Uma prancha de projeto não tem cards — tem carimbo, numeração e linhas. Então
   aqui não existe nenhum container com borda + raio + sombra empilhados. Se você
   sentir vontade de criar um, é sinal de que falta uma régua ou falta respiro.
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * Bloco de conteúdo: rótulo numerado em mono, régua full-bleed, conteúdo direto
 * no papel.
 *
 *   <Secao n="01" titulo="Visão geral" acao={<Botao .../>}>…</Secao>
 *
 * A numeração é o que dá a leitura de documento técnico. Use sequencial dentro
 * de cada tela (01, 02, 03) e não repita entre telas.
 */
export function Secao({
  n,
  titulo,
  descricao,
  acao,
  children,
  className,
}: {
  n?: string;
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-10 lg:mb-12", className)}>
      <header className="flex items-end justify-between gap-4 border-b border-sys-rule-strong pb-2">
        <div className="min-w-0">
          <h2 className="flex items-baseline gap-2">
            {n && <span className="sys-rotulo shrink-0 text-sys-ink-3">{n} /</span>}
            <span className="truncate font-sans text-[13px] font-extrabold uppercase tracking-tight text-sys-ink">
              {titulo}
            </span>
          </h2>
          {descricao && <p className="mt-1 text-[13px] text-sys-ink-2">{descricao}</p>}
        </div>
        {acao && <div className="shrink-0">{acao}</div>}
      </header>
      <div className="pt-4">{children}</div>
    </section>
  );
}

/**
 * Lista separada por hairlines. Substitui a pilha de cards: as linhas encostam
 * umas nas outras e só a régua as separa.
 */
export function Lista({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("divide-y divide-sys-rule border-b border-sys-rule", className)}>
      {children}
    </div>
  );
}

/**
 * Linha de lista. Vira `<button>` quando recebe `onClick`, para continuar
 * navegável por teclado sem precisar de role/tabIndex na mão.
 *
 * O hover é uma FAIXA de fundo — nunca elevação, nunca `scale`. Objeto plano
 * sobre papel não levanta.
 */
export function Linha({
  children,
  fim,
  onClick,
  ativo,
  className,
}: {
  children: React.ReactNode;
  fim?: React.ReactNode;
  onClick?: () => void;
  ativo?: boolean;
  className?: string;
}) {
  const conteudo = (
    <>
      <div className="min-w-0 flex-1">{children}</div>
      {fim && <div className="flex shrink-0 items-center gap-3">{fim}</div>}
    </>
  );

  const classes = cn(
    // -mx-2 px-2 faz a faixa de hover sangrar além do texto sem deslocar o layout.
    "group flex w-full items-center gap-4 -mx-2 px-2 py-3 text-left transition-colors duration-150",
    onClick && "cursor-pointer hover:bg-sys-ink/[0.05]",
    ativo && "bg-sys-accent/[0.08]",
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {conteudo}
      </button>
    );
  }
  return <div className={classes}>{conteudo}</div>;
}

/**
 * Régua solta, para separar assuntos dentro de uma mesma seção.
 * `forte` usa a régua de divisor de seção.
 */
export function Regua({ forte, className }: { forte?: boolean; className?: string }) {
  return (
    <hr
      className={cn("border-0 border-t", forte ? "border-sys-rule-strong" : "border-sys-rule", className)}
    />
  );
}
