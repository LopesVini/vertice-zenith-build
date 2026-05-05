import { Users, Briefcase, CheckSquare, Target, Search, Filter, Download, ArrowUpRight, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const stats = [
  { label: "Clientes Ativos", value: "547", icon: <Users size={20} className="text-zinc-600 dark:text-zinc-400" /> },
  { label: "Projetos em Andamento", value: "339", icon: <Briefcase size={20} className="text-zinc-600 dark:text-zinc-400" /> },
  { label: "Entregas Pendentes", value: "147", icon: <CheckSquare size={20} className="text-zinc-600 dark:text-zinc-400" /> },
  { label: "Meta de Conclusão", value: "89.75%", icon: <Target size={20} className="text-zinc-600 dark:text-zinc-400" /> },
];

const projects = [
  { 
    id: 1, 
    name: "Residencial Alphaville", 
    type: "Projeto Executivo Completo", 
    status: "On Going", 
    progress: 51, 
    dueDate: "Ago 17, 2026",
    color: "bg-blue-500",
    team: ["C", "M", "A"]
  },
  { 
    id: 2, 
    name: "Edifício Comercial Zenith", 
    type: "Arquitetura e Interiores", 
    status: "On Going", 
    progress: 89, 
    dueDate: "Ago 15, 2026",
    color: "bg-green-500",
    team: ["R", "L"]
  },
  { 
    id: 3, 
    name: "Galpão Logístico Sul", 
    type: "Estrutural e Fundações", 
    status: "On Going", 
    progress: 32, 
    dueDate: "Set 02, 2026",
    color: "bg-red-500",
    team: ["C", "T", "F", "E"]
  },
];

const chartData = [
  { name: "Jan", value: 40 },
  { name: "Fev", value: 60 },
  { name: "Mar", value: 30 },
  { name: "Abr", value: 120 },
  { name: "Mai", value: 140 },
  { name: "Jun", value: 80 },
  { name: "Jul", value: 70 },
  { name: "Ago", value: 90 },
  { name: "Set", value: 65 },
];

const team = [
  { name: "Meylina", role: "1st", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meylina" },
  { name: "Jonathan", role: "2nd", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan" },
  { name: "Yasmine", role: "3rd", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmine" },
  { name: "Ronald", role: "4th", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald" },
];

export default function HqDashboard() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</span>
              <button className="text-zinc-400 hover:text-navy dark:hover:text-white transition-colors">
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-black/20 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-3xl font-black text-navy dark:text-white">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* On Going Tasks (Projetos em Andamento) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-navy dark:text-white flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  Projetos em Andamento
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Ranking de performance de projetos</p>
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

            <div className="space-y-6">
              {projects.map((proj) => (
                <div key={proj.id} className="group">
                  <div className="flex gap-4 items-center mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${proj.color}`}>
                      {proj.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-navy dark:text-white truncate group-hover:text-blue-600 transition-colors cursor-pointer">{proj.name}</h4>
                      <p className="text-xs text-zinc-500 truncate">{proj.type}</p>
                    </div>
                    <div className="flex -space-x-2">
                      {proj.team.map((initial, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-navy flex items-center justify-center text-[10px] font-bold text-navy dark:text-white z-10">
                          {initial}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2 px-1">
                    <div className="flex items-center gap-1">
                      <span className="text-navy dark:text-zinc-300 font-medium">Status</span>
                      <span>{proj.status}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-navy dark:text-zinc-300 font-medium">Progresso</span>
                      <span>{proj.progress}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-navy dark:text-zinc-300 font-medium">Entrega</span>
                      <span>{proj.dueDate}</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-black/40 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Graphs & Team */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          {/* Bar Chart */}
          <div className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-navy dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Activity size={16} />
                  </div>
                  Gráficos e Análise
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Projetos concluídos por mês com base em tendências.</p>
              </div>
              <div className="flex items-center gap-3">
                <select className="bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 text-xs font-medium text-navy dark:text-white px-3 py-2 rounded-lg focus:outline-none">
                  <option>Mensal</option>
                  <option>Trimestral</option>
                  <option>Anual</option>
                </select>
                <button className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <Download size={14} />
                </button>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#dbeafe" radius={[4, 4, 0, 0]} className="dark:fill-blue-900/30" activeBar={{ fill: '#2563eb' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performance */}
          <div className="bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-navy dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Target size={16} />
                  </div>
                  Top Performance
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Ranking de performance da equipe interna.</p>
              </div>
              <div className="flex items-center gap-3">
                <select className="bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 text-xs font-medium text-navy dark:text-white px-3 py-2 rounded-lg focus:outline-none">
                  <option>Agosto</option>
                  <option>Setembro</option>
                </select>
                <button className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <Download size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {team.map((member, i) => (
                <div key={i} className="bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500/50 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-white/10 mb-3 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-sm text-navy dark:text-white mb-1">{member.role}</h4>
                  <p className="text-xs text-zinc-500">{member.name}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
