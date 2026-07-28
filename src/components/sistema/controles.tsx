import { forwardRef, useId } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Controles da "Prancha Técnica".

   Não reaproveitamos `components/ui/button.tsx`: ele é gerido pelo shadcn CLI
   (CLAUDE.md pede para não editá-lo à mão) e traz `rounded-md` cravado, que
   brigaria com o raio de 2px do sistema a cada uso. Um <button> próprio custa
   menos que uma pilha de overrides.
   ───────────────────────────────────────────────────────────────────────────── */

type Variante = "primario" | "secundario" | "fantasma" | "perigo";

const VARIANTE: Record<Variante, string> = {
  primario: "bg-sys-accent text-white hover:bg-sys-accent/90",
  secundario:
    "border border-sys-rule-strong text-sys-ink hover:bg-sys-ink/[0.05] hover:border-sys-ink/40",
  fantasma: "text-sys-ink-2 hover:text-sys-ink hover:bg-sys-ink/[0.05]",
  perigo: "border border-sys-danger/40 text-sys-danger hover:bg-sys-danger/[0.08]",
};

export interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamanho?: "sm" | "md";
  carregando?: boolean;
  icone?: React.ReactNode;
}

export const Botao = forwardRef<HTMLButtonElement, BotaoProps>(function Botao(
  { variante = "secundario", tamanho = "md", carregando, icone, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      // 44px de altura no `md` não é estética: é o mínimo de alvo de toque.
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sys font-sans font-semibold",
        "transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45",
        tamanho === "md" ? "h-11 px-4 text-[13px]" : "h-9 px-3 text-[13px]",
        VARIANTE[variante],
        className,
      )}
      disabled={disabled || carregando}
      {...props}
    >
      {carregando ? <Loader2 size={15} className="animate-spin" /> : icone}
      {children}
    </button>
  );
});

/* ────────────────────────────────────────────────────────────────────────────*/

export interface CampoProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  dica?: string;
  erro?: string;
}

/**
 * Campo de formulário com rótulo SEMPRE visível (placeholder não é rótulo: some
 * na hora em que o usuário mais precisa dele) e erro ancorado abaixo do campo,
 * anunciado via `role="alert"`.
 */
export const Campo = forwardRef<HTMLInputElement, CampoProps>(function Campo(
  { rotulo, dica, erro, id, className, ...props },
  ref,
) {
  const gerado = useId();
  const inputId = id ?? gerado;
  const dicaId = `${inputId}-dica`;
  const erroId = `${inputId}-erro`;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-2 block">
        <span className="sys-rotulo text-sys-ink-2">{rotulo}</span>
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={erro ? true : undefined}
        aria-describedby={cn(dica && dicaId, erro && erroId) || undefined}
        className={cn(
          // Fundo transparente sobre uma régua inferior: o campo é uma linha de
          // preenchimento de prancha, não uma caixinha.
          "h-11 w-full rounded-none border-0 border-b bg-transparent px-0 text-[15px] text-sys-ink",
          // Sem `focus:outline-none` em lugar nenhum do sistema: o anel de foco
          // vem de `.sys :focus-visible` (sistema.css) e não pode ser desligado.
          "placeholder:text-sys-ink-3/70 transition-colors duration-150",
          erro
            ? "border-sys-danger"
            : "border-sys-rule-strong focus:border-sys-accent",
          className,
        )}
        {...props}
      />
      {dica && !erro && (
        <p id={dicaId} className="mt-1.5 text-[13px] text-sys-ink-3">
          {dica}
        </p>
      )}
      {erro && (
        <p id={erroId} role="alert" className="mt-1.5 text-[13px] font-medium text-sys-danger">
          {erro}
        </p>
      )}
    </div>
  );
});
