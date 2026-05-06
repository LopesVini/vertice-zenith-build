import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, CheckSquare, Target, Search, Filter, Download, ArrowUpRight, TrendingUp, Clock } from "lucide-react";
import { motion, useInView } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashStats {
  clients: number;
  projects: number;
  pendingUpdates: number;
  conclusionRate: number;
}

interface LiveProject {
  id: string;
  name: string;
  type: string;
  progress: number;
  end_date: string | null;
  color: string;
  team: string[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

function useDashData() {
  const [stats, setStats]       = useState<DashStats>({ clients: 0, projects: 0, pendingUpdates: 0, conclusionRate: 0 });
  const [liveProjs, setLiveProjs] = useState<LiveProject[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      const [
        { count: clientCount },
        { data: projects },
        { count: pendingCount },
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
        supabase.from("projects").select("id, name, type, progress, status, end_date, color, team").order("created_at", { ascending: false }),
        supabase.from("updates").select("id", { count: "exact", head: true }).eq("color", "bg-accent"),
      ]);

      const allProjects = (projects ?? []) as LiveProject[];
      const total = allProjects.length;
      const done  = allProjects.filter((p: any) => p.status === "Concluído").length;

      setStats({
        clients:        clientCount ?? 0,
        projects:       total,
        pendingUpdates: pendingCount ?? 0,
        conclusionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      });

      setLiveProjs(allProjects.slice(0, 3));
      setLoading(false);
    }
    load();
  }, []);

  return { stats, liveProjs, loading };
}

// ── Static chart data (histórico mock por ora) ────────────────────────────────

const barData = [
  { name: "Jan", value: 4 }, { name: "Fev", value: 6 }, { name: "Mar", value: 3 },
  { name: "Abr", value: 9 }, { name: "Mai", value: 11 }, { name: "Jun", value: 7 },
  { name: "Jul", value: 8 }, { name: "Ago", value: 12 }, { name: "Set", value: 6 },
];

const areaData = [
  { month: "Jan", ARQ: 2, EST: 1, ELE: 1, HID: 0 },
  { month: "Fev", ARQ: 3, EST: 2, ELE: 1, HID: 1 },
  { month: "Mar", ARQ: 2, EST: 2, ELE: 2, HID: 1 },
  { month: "Abr", ARQ: 4, EST: 3, ELE: 2, HID: 2 },
  { month: "Mai", ARQ: 5, EST: 4, ELE: 3, HID: 2 },
  { month: "Jun", ARQ: 4, EST: 3, ELE: 3, HID: 3 },
  { month: "Jul", ARQ: 6, EST: 5, ELE: 4, HID: 3 },
  { month: "Ago", ARQ: 7, EST: 5, ELE: 4, HID: 4 },
];

const pieData = [
  { name: "Arquitetura",     value: 34, color: "#2563EB" },
  { name: "Estrutural",      value: 28, color: "#7C3AED" },
  { name: "Elétrico",        value: 20, color: "#F59E0B" },
  { name: "Hidrossanitário", value: 18, color: "#10B981" },
];

const activity = [
  { icon: "📐", text: "Prancha ARQ-14 aprovada",  sub: "Residencial Alphaville", time: "2m"  },
  { icon: "⚡", text: "Rev. Elétrica enviada",     sub: "Zenith Comercial",       time: "18m" },
  { icon: "💧", text: "Clash HID resolvido",       sub: "Galpão Logístico Sul",  time: "1h"  },
  { icon: "📋", text: "Briefing finalizado",       sub: "Villa Nova Casa",        time: "3h"  },
];

const colorMap: Record<string, string> = {
  blue:   "bg-blue-50   dark:bg-blue-500/10   text-blue-600",
  violet: "bg-violet-50 dark:bg-violet-500/10 text-violet-600",
  amber:  "bg-amber-50  dark:bg-amber-500/10  text-amber-600",
  green:  "bg-green-50  dark:bg-green-500/10  text-green-600",
};

function fmtDue(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
}

// ── Animated Counter ──────────────────────────────────────────────────────────

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-navy border border-zinc-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="font-bold text-navy dark:text-white mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function HqDashboard() {
  const navigate = useNavigate();
  const { stats, liveProjs, loading } = useDashData();

  const statCards = [
    { label: "Clientes Ativos",       value: stats.clients,        suffix: "",  icon: Users,       color: "blue",   trend: "total" },
    { label: "Projetos em Andamento", value: stats.projects,       suffix: "",  icon: Briefcase,   color: "violet", trend: "total" },
    { label: "Entregas Pendentes",    value: stats.pendingUpdates, suffix: "",  icon: CheckSquare, color: "amber",  trend: "aguardando" },
    { label: "Taxa de Conclusão",     value: stats.conclusionRate, suffix: "%", icon: Target,      color: "green",  trend: "projetos" },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
              className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                  <Icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">
                  <TrendingUp size={10} /> {stat.trend}
                </div>
              </div>
              <p className="text-2xl font-black text-navy dark:text-white mb-1">
                {loading ? "—" : <AnimatedNumber target={stat.value} suffix={stat.suffix} />}
              </p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Col 1 – Projetos em Andamento */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-navy dark:text-white flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                Projetos em Andamento
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Performance por projeto</p>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                <Search size={14} />
              </button>
              <button className="w-8 h-8 rounded-full border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                <Filter size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-7">
            {loading && (
              <p className="text-xs text-zinc-400 text-center py-8">Carregando projetos...</p>
            )}
            {!loading && liveProjs.length === 0 && (
              <p className="text-xs text-zinc-400 text-center py-8">Nenhum projeto criado ainda.</p>
            )}
            {liveProjs.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="group"
              >
                <div className="flex gap-3 items-center mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm ${proj.color || "bg-blue-500"}`}>
                    {proj.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-navy dark:text-white truncate group-hover:text-blue-600 transition-colors cursor-pointer">{proj.name}</h4>
                    <p className="text-xs text-zinc-500 truncate">{proj.type || "Projeto"}</p>
                  </div>
                  <div className="flex -space-x-2">
                    {(proj.team ?? []).slice(0, 4).map((initial, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-700 border-2 border-white dark:border-navy flex items-center justify-center text-[9px] font-bold text-navy dark:text-white">
                        {initial[0]?.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1.5 px-0.5">
                  <span className="flex items-center gap-1"><Clock size={10} /> {fmtDue(proj.end_date)}</span>
                  <span className="font-bold text-navy dark:text-zinc-300">{proj.progress}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${proj.progress}%` }}
                    transition={{ delay: 0.6 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <button onClick={() => navigate("/hq/projects")} className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10">
            Ver todos os projetos <ArrowUpRight size={14} />
          </button>
        </motion.div>

        {/* Col 2 – Gráfico de Barras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-sm text-navy dark:text-white">Entregas Mensais</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Projetos entregues por mês</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 text-xs text-navy dark:text-white px-2 py-1.5 rounded-lg focus:outline-none">
                <option>2026</option>
                <option>2025</option>
              </select>
              <button className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                <Download size={13} />
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:opacity-10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" name="Entregas" fill="#DBEAFE" radius={[6,6,0,0]} activeBar={{ fill: '#2563EB' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 grid grid-cols-3 gap-3">
            {[
              { label: "Média mensal", value: "7.4" },
              { label: "Melhor mês",   value: "Ago" },
              { label: "Total 2026",   value: "66"  },
            ].map((kpi, i) => (
              <div key={i} className="text-center">
                <p className="text-base font-black text-navy dark:text-white">{kpi.value}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Col 3 – Donut + Atividade Recente */}
        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="font-bold text-sm text-navy dark:text-white mb-1">Distribuição por Disciplina</h3>
            <p className="text-xs text-zinc-500 mb-4">Portfólio atual de serviços</p>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">{d.name}</span>
                    </div>
                    <span className="text-xs font-bold text-navy dark:text-white">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex-1"
          >
            <h3 className="font-bold text-sm text-navy dark:text-white mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-default"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-black/20 flex items-center justify-center text-sm shrink-0">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-navy dark:text-white truncate">{a.text}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{a.sub}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0">{a.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Row – Area Chart ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-navy dark:text-white">Volume de Projetos por Disciplina</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Evolução mensal — projetos ativos por área técnica</p>
          </div>
          <button className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
            <Download size={13} />
          </button>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {[["ARQ","#2563EB"],["EST","#7C3AED"],["ELE","#F59E0B"],["HID","#10B981"]].map(([key, color]) => (
                  <linearGradient key={key} id={`grad${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:opacity-10" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="ARQ" name="Arquitetura"     stroke="#2563EB" fill="url(#gradARQ)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="EST" name="Estrutural"      stroke="#7C3AED" fill="url(#gradEST)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="ELE" name="Elétrico"        stroke="#F59E0B" fill="url(#gradELE)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="HID" name="Hidrossanitário" stroke="#10B981" fill="url(#gradHID)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}
