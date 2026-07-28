import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Átomos da "Prancha Técnica".

   Um acento só (o azul do logo) + o ocre reservado a SINAL (pendência, atraso,
   aguardando). Ocre nunca é decoração: se aparecer ocre, existe algo a fazer.
   ───────────────────────────────────────────────────────────────────────────── */

export type Tom = "neutro" | "acento" | "ocre" | "erro" | "ok";

const TINTA: Record<Tom, string> = {
  neutro: "text-sys-ink-3",
  acento: "text-sys-accent",
  ocre: "text-sys-ochre",
  erro: "text-sys-danger",
  ok: "text-sys-ok",
};

const FUNDO: Record<Tom, string> = {
  neutro: "bg-sys-ink/10",
  acento: "bg-sys-accent",
  ocre: "bg-sys-ochre",
  erro: "bg-sys-danger",
  ok: "bg-sys-ok",
};

/**
 * Rótulo mono em caixa alta — o tom de voz técnico da interface. Serve para
 * metadados, eixos, cabeçalhos de coluna e legendas. Nunca para texto corrido:
 * 10px com tracking largo é ótimo para etiquetar e péssimo para ler.
 */
export function Rotulo({
  children,
  tom = "neutro",
  className,
}: {
  children: React.ReactNode;
  tom?: Tom;
  className?: string;
}) {
  return <span className={cn("sys-rotulo", TINTA[tom], className)}>{children}</span>;
}

/**
 * Etiqueta de estado. Retangular, hairline, mono — não é pílula colorida.
 *
 * `icone` existe porque cor sozinha não pode carregar significado (daltonismo,
 * impressão em preto e branco, telas ruins de obra).
 */
export function Etiqueta({
  children,
  tom = "neutro",
  icone,
  className,
}: {
  children: React.ReactNode;
  tom?: Tom;
  icone?: React.ReactNode;
  className?: string;
}) {
  const borda: Record<Tom, string> = {
    neutro: "border-sys-rule-strong bg-sys-ink/[0.04]",
    acento: "border-sys-accent/40 bg-sys-accent/[0.08]",
    ocre: "border-sys-ochre/40 bg-sys-ochre/[0.10]",
    erro: "border-sys-danger/40 bg-sys-danger/[0.08]",
    ok: "border-sys-ok/40 bg-sys-ok/[0.08]",
  };

  return (
    <span
      className={cn(
        "sys-rotulo inline-flex items-center gap-1.5 rounded-sys border px-1.5 py-1",
        borda[tom],
        tom === "neutro" ? "text-sys-ink-2" : TINTA[tom],
        className,
      )}
    >
      {icone}
      {children}
    </span>
  );
}

/**
 * Número de dado, com rótulo em cima e unidade rebaixada.
 *
 * `escala="heroi"` é o ÚNICO lugar onde o Playfair italic aparece — no máximo um
 * por tela. É o eco do "Precisão." do hero institucional; usado duas vezes na
 * mesma tela, vira maneirismo e perde a força.
 */
export function Dado({
  valor,
  unidade,
  rotulo,
  escala = "md",
  tom = "neutro",
  className,
}: {
  valor: React.ReactNode;
  unidade?: string;
  rotulo?: string;
  escala?: "heroi" | "md" | "sm";
  tom?: Tom;
  className?: string;
}) {
  const corpo = {
    heroi: "font-drama italic text-[44px] leading-[0.9] font-normal",
    md: "font-sans text-[28px] leading-none font-extrabold tracking-tight",
    sm: "font-sans text-[20px] leading-none font-extrabold tracking-tight",
  }[escala];

  return (
    <div className={cn("min-w-0", className)}>
      {rotulo && (
        <p className="mb-1.5">
          <Rotulo>{rotulo}</Rotulo>
        </p>
      )}
      <p
        data-dado
        className={cn(corpo, tom === "neutro" ? "text-sys-ink" : TINTA[tom])}
      >
        {valor}
        {unidade && (
          <span className="ml-0.5 align-baseline font-sans text-[15px] font-medium text-sys-ink-3">
            {unidade}
          </span>
        )}
      </p>
    </div>
  );
}

/**
 * Barra de progresso reta, com a cota em mono na ponta — como a cota de uma
 * prancha. Sem cantos arredondados, sem gradiente, sem animação de preenchimento
 * (o valor é informação, não espetáculo).
 */
export function Barra({
  valor,
  tom = "acento",
  cota = true,
  className,
}: {
  valor: number;
  tom?: Tom;
  cota?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(valor)));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="h-[6px] flex-1 bg-sys-ink/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full transition-[width] duration-300 ease-out", FUNDO[tom])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {cota && (
        <span data-dado className={cn("sys-rotulo shrink-0", TINTA[tom])}>
          {pct}%
        </span>
      )}
    </div>
  );
}

/**
 * Bloco de iniciais em mono — substitui o avatar gerado por API pública, que é a
 * assinatura mais óbvia de interface montada às pressas.
 */
export function Iniciais({
  nome,
  className,
}: {
  nome: string;
  className?: string;
}) {
  const iniciais = nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-sys border border-sys-rule-strong bg-sys-ink/[0.04] font-mono text-[11px] font-medium tracking-tecnico text-sys-ink-2",
        className,
      )}
    >
      {iniciais || "—"}
    </span>
  );
}
