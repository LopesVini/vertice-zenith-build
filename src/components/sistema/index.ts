/**
 * Linguagem visual do sistema logado (QG + Portal): "Prancha Técnica".
 *
 * Importe daqui em vez de repetir classes soltas nas páginas:
 *   import { Secao, Lista, Linha, Dado, Barra, Etiqueta } from "@/components/sistema";
 *
 * Regras que estes componentes existem para impedir:
 *  · nada de card (borda + raio + sombra empilhados) — use `Secao` e `Lista`;
 *  · um acento só (azul do logo); ocre é SINAL, nunca decoração;
 *  · número de dado sempre tabular; rótulo sempre mono em caixa alta;
 *  · Playfair italic (`Dado escala="heroi"`) no máximo uma vez por tela;
 *  · sombra só onde há empilhamento real (modal, dropdown, popover).
 */
export { Secao, Lista, Linha, Regua } from "./estrutura";
export { Rotulo, Etiqueta, Dado, Barra, Iniciais, type Tom } from "./primitivos";
export { Botao, Campo, type BotaoProps, type CampoProps } from "./controles";
