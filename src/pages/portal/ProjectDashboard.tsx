import { useState, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import {
  Activity, FileCheck, Layers, Clock as ClockIcon,
  Check, Send, Sparkles, Bot,
  Compass, Ruler, Blocks, ClipboardCheck, Award, Briefcase,
} from "lucide-react";

// --- Mock Data: Consultoria de Projetos ---
const chartData = [
  { mes: "Jan", arq: 20, est: 10, ele: 0, hid: 0 },
  { mes: "Fev", arq: 45, est: 25, ele: 10, hid: 5 },
  { mes: "Mar", arq: 70, est: 50, ele: 30, hid: 25 },
  { mes: "Abr", arq: 90, est: 75, ele: 55, hid: 50 },
  { mes: "Mai", arq: 100, est: 90, ele: 75, hid: 70 },
];

const milestones = [
  { id: 1, icon: Briefcase, title: "Briefing", date: "10/Jan", status: "done" as const },
  { id: 2, icon: Compass, title: "Anteprojeto", date: "22/Mar", status: "done" as const },
  { id: 3, icon: Ruler, title: "Executivo", date: "Em andamento", status: "active" as const },
  { id: 4, icon: Blocks, title: "Compat. BIM", date: "Jul/26", status: "upcoming" as const },
  { id: 5, icon: ClipboardCheck, title: "Aprovação", date: "Ago/26", status: "upcoming" as const },
  { id: 6, icon: Award, title: "Entrega", date: "Set/26", status: "upcoming" as const },
];

const notifications = [
  { id: 1, title: "Revisão Estrutural Aprovada", text: "R03 do projeto estrutural validada pelo cliente.", date: "Hoje, 09:42", color: "bg-primary" },
  { id: 2, title: "Compatibilização BIM Iniciada", text: "Federação dos modelos arquitetônico, estrutural e elétrico em curso.", date: "Ontem", color: "bg-accent" },
  { id: 3, title: "Prancha Hidrossanitária", text: "PH-04 enviada para análise técnica.", date: "03/05", color: "bg-zinc-500" },
];

const suggestedQuestions = [
  "Qual o status do projeto elétrico?",
  "Como funciona a compatibilização BIM?",
  "Quando posso baixar as pranchas?",
];

const mockMessages = [
  { id: 1, role: "bot" as const, text: "Olá! Sou a Vertice AI. Posso esclarecer dúvidas sobre seu projeto, o portal ou engenharia em geral." },
  { id: 2, role: "user" as const, text: "Qual a fase atual do meu projeto?" },
  { id: 3, role: "bot" as const, text: "Você está no Projeto Executivo (fase 3 de 6). 65% concluído, próxima entrega em 12 dias." },
];

export default function ProjectDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState("");

  useGSAP(() => {
    gsap.from(".gsap-card", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-3 font-mono text-zinc-300 h-[calc(100vh-4rem)] overflow-hidden"
    >
      {/* Header compacto */}
      <div className="gsap-card flex justify-between items-center border-b border-zinc-200 dark:border-white/10 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 text-accent px-2.5 py-1 rounded font-bold text-xs">VRT-2601</div>
          <h1 className="text-2xl font-black tracking-tighter text-navy dark:text-white uppercase font-sans">Painel do Projeto</h1>
          <span className="hidden md:inline text-[10px] text-zinc-600 dark:text-zinc-300 font-mono">RESIDÊNCIA ALPHAVILLE • 4 DISCIPLINAS</span>
        </div>
        <p className="text-[10px] text-zinc-600 dark:text-zinc-300 hidden sm:block">ATUALIZADO • HOJE 10:25</p>
      </div>

      {/* Top Stats - 4 widgets compactos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        <StatCard label="PROGRESSO DO PROJETO" value="65%" sub="3 DE 6 FASES" icon={Activity} accent />
        <StatCard label="PRANCHAS ENTREGUES" value="24" sub="DE 38 PREVISTAS" icon={FileCheck} />
        <StatCard label="DISCIPLINAS ATIVAS" value="4" sub="ARQ • EST • ELE • HID" icon={Layers} />
        <StatCard label="PRÓXIMA ENTREGA" value="12d" sub="EXECUTIVO ESTRUTURAL" icon={ClockIcon} alert />
      </div>

      {/* Linha principal: [Chart + Marcos] (2/3) + [AI Chat + Notificações] (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
        {/* Coluna esquerda: Chart (top) + Marcos (bottom) */}
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
        {/* Chart */}
        <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-4 flex flex-col shadow-lg flex-1 min-h-0">
          <div className="flex justify-between items-center mb-3 shrink-0">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-zinc-600 dark:text-zinc-300">EVOLUÇÃO POR DISCIPLINA</p>
              <p className="text-sm font-bold text-navy dark:text-white mt-0.5">% de Pranchas Concluídas</p>
            </div>
            <div className="flex flex-wrap gap-3 text-[9px] font-bold tracking-widest">
              <Legend color="#CC5833" label="ARQ" />
              <Legend color="#0EA5E9" label="EST" />
              <Legend color="#F59E0B" label="ELE" />
              <Legend color="#3B82F6" label="HID" />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="mes" stroke="#ffffff30" fontSize={9} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff30" fontSize={9} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#061024', borderColor: '#ffffff20', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="arq" stroke="#CC5833" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="est" stroke="#0EA5E9" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ele" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="hid" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marcos timeline horizontal - mesma largura do chart */}
        <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-4 shadow-lg flex flex-col shrink-0 h-36">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-[10px] font-bold tracking-widest text-zinc-600 dark:text-zinc-300">FASES DO PROJETO</span>
            </div>
            <div className="text-[9px] border border-accent/30 text-accent px-2 py-0.5 rounded font-bold">2 / 6 ENTREGUES</div>
          </div>

          <div className="relative flex-1 flex items-center">
            <div className="absolute left-4 right-4 top-1/2 h-[2px] bg-zinc-200 dark:bg-white/10 -translate-y-1/2" />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
              style={{ transformOrigin: "left", width: `${(2 / (milestones.length - 1)) * 100 - 4}%` }}
              className="absolute left-4 top-1/2 h-[2px] bg-gradient-to-r from-primary via-primary to-accent -translate-y-1/2"
            />

            <div className="relative flex justify-between w-full">
              {milestones.map((m, index) => {
                const Icon = m.icon;
                const isDone = m.status === "done";
                const isActive = m.status === "active";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.3, duration: 0.4 }}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="relative">
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
                      )}
                      <div
                        className={`relative w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-110 ${
                          isDone
                            ? "bg-primary border-primary text-white"
                            : isActive
                            ? "bg-accent border-accent text-white shadow-lg shadow-accent/50"
                            : "bg-white dark:bg-navy-light border-zinc-300 dark:border-white/20 text-zinc-400"
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-4 h-4" />}
                      </div>
                    </div>
                    <p className={`mt-1.5 text-[10px] font-bold tracking-tight text-center ${isActive ? "text-accent" : isDone ? "text-navy dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>
                      {m.title}
                    </p>
                    <p className="text-[9px] text-zinc-500 dark:text-zinc-500 text-center">{m.date}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        </div>

        {/* Coluna direita: AI Chat (top) + Notificações (bottom) */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* AI Chat */}
          <div className="gsap-card relative bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl shadow-lg flex flex-col flex-[1.6] min-h-0 overflow-hidden">
            {/* Glow gradient sutil de fundo */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            {/* Header */}
            <div className="relative flex justify-between items-center px-3 py-2.5 border-b border-zinc-200 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border-2 border-white dark:border-navy-light" />
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-black text-navy dark:text-white tracking-tight flex items-center gap-1">
                    VERTICE AI
                    <Sparkles className="w-3 h-3 text-accent" />
                  </p>
                  <p className="text-[9px] text-zinc-500 dark:text-zinc-400">Online • Resposta instantânea</p>
                </div>
              </div>
              <div className="text-[9px] border border-accent/40 text-accent px-1.5 py-0.5 rounded font-bold">BETA</div>
            </div>

            {/* Mensagens */}
            <div className="relative flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-0">
              {mockMessages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-zinc-100 dark:bg-white/5 text-navy dark:text-zinc-200 rounded-bl-sm border border-zinc-200 dark:border-white/10"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Sugestões rápidas */}
              <div className="pt-1 flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    onClick={() => setChatInput(q)}
                    className="text-[9px] px-2 py-1 rounded-full bg-accent/10 hover:bg-accent hover:text-white text-accent border border-accent/20 transition-colors font-medium"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="relative px-3 py-2.5 border-t border-zinc-200 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-full pl-3 pr-1 py-1 focus-within:border-primary/50 transition-colors">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Pergunte algo..."
                  className="flex-1 bg-transparent text-[11px] text-navy dark:text-white placeholder:text-zinc-400 outline-none"
                />
                <button className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md">
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Notificações compactas */}
          <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl shadow-lg flex flex-col overflow-hidden flex-[1.1] min-h-0">
            <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center bg-zinc-50 dark:bg-black/20 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{notifications.length}</div>
                <span className="text-[10px] font-bold text-navy dark:text-white tracking-widest">ATUALIZAÇÕES</span>
              </div>
              <button className="text-[9px] text-zinc-500 hover:text-navy dark:hover:text-white">VER TUDO</button>
            </div>
            <div className="p-2 space-y-1.5 flex-1 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/10 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${n.color}`} />
                    <span className="text-[10px] font-bold text-navy dark:text-white truncate">{n.title}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">{n.text}</p>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-600 mt-1">{n.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// --- Subcomponentes ---
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  alert,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent?: boolean;
  alert?: boolean;
}) {
  return (
    <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-3 shadow-lg hover:border-zinc-300 dark:hover:border-white/30 transition-colors">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[9px] font-bold tracking-widest text-zinc-600 dark:text-zinc-300">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${alert ? 'text-accent' : 'text-zinc-500 dark:text-zinc-400'}`} />
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-3xl font-black tracking-tighter font-sans ${accent ? 'text-accent' : alert ? 'text-accent' : 'text-navy dark:text-white'}`}>
          {value}
        </span>
        <span className="text-[9px] text-zinc-600 dark:text-zinc-400 text-right leading-tight pb-1">{sub}</span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color }} />
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}
