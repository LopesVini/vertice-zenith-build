import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity, Box, AlertTriangle, CheckCircle2 } from "lucide-react";
import ThreeDViewer from "../../components/portal/ThreeDViewer";

// --- Mock Data ---
const chartData = [
  { month: "Jan", previsto: 10, realizado: 10 },
  { month: "Fev", previsto: 25, realizado: 22 },
  { month: "Mar", previsto: 40, realizado: 45 },
  { month: "Abr", previsto: 60, realizado: 58 },
  { month: "Mai", previsto: 75, realizado: 78 },
  { month: "Jun", previsto: 90, realizado: 88 },
  { month: "Jul", previsto: 100, realizado: 95 },
];

const teamRanking = [
  { id: 1, name: "CARLOS", role: "@ENGENHEIRO_LIDER", score: "98 PTS", streak: "3 WEEKS STREAK 🔥", color: "bg-primary" },
  { id: 2, name: "MARIANA", role: "@ARQUITETA", score: "85 PTS", streak: "", color: "bg-accent" },
  { id: 3, name: "ROBERTO", role: "@CLIENTE", score: "12 PTS", streak: "", color: "bg-zinc-600" },
];

const notifications = [
  { id: 1, title: "PAGAMENTO CONFIRMADO", severity: "MED", text: "A parcela referente à fundação foi processada.", date: "10/05/2026", color: "text-primary" },
  { id: 2, title: "ATUALIZAÇÃO DE PROJETO", severity: "HIGH", text: "Nova revisão estrutural enviada para aprovação do condomínio.", date: "08/05/2026", color: "text-accent" },
  { id: 3, title: "ALERTA DE PRAZO", severity: "LOW", text: "Entrega de esquadrias reagendada para dia 20.", date: "05/05/2026", color: "text-zinc-400" },
];

export default function ProjectDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animação GSAP Stagger
  useGSAP(() => {
    gsap.from(".gsap-card", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full font-mono text-zinc-300 relative">
      
      {/* Esquerda / Centro: Conteúdo Principal */}
      <div className="flex-1 space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-6 gsap-card">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 text-primary px-3 py-1 rounded-[0.25rem] font-bold text-sm">
              [ ]
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-navy dark:text-white uppercase font-sans">
              Visão Geral
            </h1>
          </div>
          <p className="text-xs text-zinc-500 hidden sm:block">Ultima atualização: Ontem, 18:30</p>
        </div>

        {/* Top Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-5 relative overflow-hidden group hover:border-zinc-300 dark:hover:border-white/30 hover:bg-zinc-50 dark:hover:bg-navy-light/80 transition-colors shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400">PROGESSO FÍSICO</span>
              </div>
              <Activity className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-5xl font-black text-navy dark:text-white font-sans tracking-tighter">78%</span>
                <p className="text-[10px] text-zinc-500 mt-1">CRONOGRAMA GERAL</p>
              </div>
              <div className="flex flex-col items-end">
                <ArrowUpRight className="w-8 h-8 text-primary" strokeWidth={3} />
                <ArrowUpRight className="w-8 h-8 text-primary/30 -mt-3" strokeWidth={3} />
              </div>
            </div>
          </div>

          <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-5 relative overflow-hidden group hover:border-zinc-300 dark:hover:border-white/30 hover:bg-zinc-50 dark:hover:bg-navy-light/80 transition-colors shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400">DESVIO DE PRAZO</span>
              </div>
              <AlertTriangle className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-5xl font-black text-navy dark:text-white font-sans tracking-tighter">-2</span>
                <p className="text-[10px] text-zinc-500 mt-1">DIAS DE ATRASO (CHUVAS)</p>
              </div>
              <div className="flex flex-col items-end">
                <ArrowDownRight className="w-8 h-8 text-accent" strokeWidth={3} />
                <ArrowDownRight className="w-8 h-8 text-accent/30 -mt-3" strokeWidth={3} />
              </div>
            </div>
          </div>

          <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-5 relative overflow-hidden group hover:border-zinc-300 dark:hover:border-white/30 hover:bg-zinc-50 dark:hover:bg-navy-light/80 transition-colors shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-zinc-300 dark:bg-white/20 rounded-full" />
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400">OCORRÊNCIAS</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-5xl font-black text-navy dark:text-white font-sans tracking-tighter">0</span>
                <div className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block">
                  SEMANA TRANQUILA 🔥
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Main Chart Section */}
        <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-6 hover:border-zinc-300 dark:hover:border-white/30 transition-colors shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4 text-xs font-bold">
              <button className="bg-primary text-white px-3 py-1 rounded transition-transform hover:scale-105 active:scale-95">MÊS</button>
              <button className="text-zinc-500 hover:text-navy dark:hover:text-white transition-colors">TRIMESTRE</button>
              <button className="text-zinc-500 hover:text-navy dark:hover:text-white transition-colors">ANO</button>
            </div>
            <div className="flex gap-4 text-[10px] font-bold tracking-widest">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rotate-45" /> PREVISTO</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-accent rotate-45" /> REALIZADO</div>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff30" fontSize={10} tickMargin={10} axisLine={false} />
                <YAxis stroke="#ffffff30" fontSize={10} tickFormatter={(value) => `${value}%`} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#061024', borderColor: '#ffffff10', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <ReferenceLine y={100} stroke="#ffffff20" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="previsto" stroke="#2E4036" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="realizado" stroke="#CC5833" strokeWidth={2} dot={{ r: 4, fill: '#CC5833', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Equipe / Ranking */}
          <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-white/30 transition-colors shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">Equipe Ativa</span>
              </div>
              <div className="text-[10px] border border-accent/30 text-accent px-2 py-0.5 rounded font-bold">2 ATIVOS</div>
            </div>
            <div className="space-y-3">
              {teamRanking.map((member, index) => (
                <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                  <div className={`w-6 h-6 flex items-center justify-center rounded text-white font-bold text-xs ${member.color}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-navy dark:text-white group-hover:text-primary transition-colors">{member.name}</span>
                      <span className="text-[10px] text-zinc-500">{member.role}</span>
                    </div>
                    {member.streak && <span className="text-[10px] text-accent">{member.streak}</span>}
                  </div>
                  <div className="text-xs border border-zinc-200 dark:border-white/10 px-2 py-1 rounded bg-zinc-100 dark:bg-black/30 text-navy dark:text-zinc-300">
                    {member.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status BIM */}
          <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-5 relative overflow-hidden hover:border-zinc-300 dark:hover:border-white/30 transition-colors shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400">STATUS DO MODELO BIM</span>
              </div>
              <div className="text-[10px] border border-primary/30 text-primary px-2 py-0.5 rounded font-bold">ONLINE</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-black/20 p-3 rounded-lg">
                  <p className="text-[10px] text-zinc-500 mb-1">■ ARQUIVOS FEDERADOS</p>
                  <p className="text-xl font-black text-primary">3/3</p>
                  <p className="text-[10px] text-primary/80 dark:text-primary/50">[SINCRONIZADO]</p>
                </div>
                <div className="border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-black/20 p-3 rounded-lg">
                  <p className="text-[10px] text-zinc-500 mb-1">■ INTEGRIDADE IFC</p>
                  <p className="text-xl font-black text-navy dark:text-white">99.9%</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-600">[VERIFICADO]</p>
                </div>
              </div>

              {/* Icone 3D Abstrato Wireframe */}
              <div className="w-32 h-32 relative">
                <Box className="w-full h-full text-primary/20 stroke-[0.5]" />
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Box className="w-16 h-16 text-primary stroke-[1]" />
                </motion.div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Direita: Sidebar / Timeline / Clock */}
      <div className="w-full xl:w-80 flex flex-col gap-4 relative">
        
        {/* Retro Clock Widget - SEM TEXTURA */}
        <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] text-zinc-500">HOJE</span>
            <span className="text-[10px] text-zinc-500">MAIO 5, 2026</span>
          </div>
          <div className="text-center my-6">
            <div className="text-4xl font-black text-navy dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] tracking-tighter">
              10:25 AM
            </div>
          </div>
          <div className="flex justify-between items-end mt-6 text-[10px] text-zinc-600 dark:text-zinc-400">
            <span>22°C</span>
            <div className="text-right">
              <p className="text-navy dark:text-white font-bold">SÃO PAULO, BRASIL</p>
              <p className="text-zinc-500 dark:text-zinc-600">UTC-3</p>
            </div>
          </div>
        </div>

        {/* Notifications / Timeline Widget */}
        <div className="gsap-card bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg">
          <div className="p-4 border-b border-zinc-200 dark:border-white/15 flex justify-between items-center bg-zinc-50 dark:bg-black/20">
            <div className="flex items-center gap-2">
              <div className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded">3</div>
              <span className="text-xs font-bold text-navy dark:text-white">NOTIFICAÇÕES</span>
            </div>
            <button className="text-[10px] text-zinc-500 hover:text-navy dark:hover:text-white transition-colors">CLEAR ALL</button>
          </div>
          
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/10 p-3 rounded-lg hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-1.5 h-1.5 rounded-full bg-current ${notif.color}`} />
                  <span className="text-[10px] font-bold text-navy dark:text-white">{notif.title}</span>
                  <span className="text-[8px] bg-black/5 dark:bg-white/10 px-1 rounded text-zinc-500 dark:text-zinc-400">{notif.severity}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{notif.text}</p>
                <p className="text-[10px] text-zinc-600">{notif.date}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Model Viewer Layer (Full Width Bottom) */}
      <div className="gsap-card col-span-full pt-8 w-full block xl:hidden">
         <ThreeDViewer />
      </div>

    </div>
  );
}
