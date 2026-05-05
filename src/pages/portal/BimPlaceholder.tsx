import { Box, Layers, Play, Settings, ShieldCheck, Search, ChevronRight, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function BimPlaceholder() {
  const buildingTree = [
    { name: "Modelo Federado (Geral)", type: "model", status: "online" },
    { 
      name: "Superestrutura", type: "folder", 
      children: [
        { name: "Laje Térreo", type: "layer" },
        { name: "Pilares Pav. Superior", type: "layer" },
      ]
    },
    { 
      name: "Instalações MEP", type: "folder",
      children: [
        { name: "Projeto Elétrico", type: "layer" },
        { name: "Projeto Hidrossanitário", type: "layer", warning: true },
      ]
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full font-mono text-zinc-300 relative gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-zinc-200 dark:border-white/5 pb-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="bg-accent/20 text-accent px-3 py-1 rounded-[0.25rem] font-bold text-sm">
            [ IFC ]
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-navy dark:text-white uppercase font-sans">
            Modelo BIM Integrado
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-zinc-200 dark:bg-white/10 text-navy dark:text-white text-xs font-bold rounded hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors">
            SINCRONIZAR
          </button>
          <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Play size={14} /> MODO APRESENTAÇÃO
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar / Tree View */}
        <div className="w-80 bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/15 rounded-2xl p-4 flex flex-col shadow-lg overflow-hidden">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar elementos..." 
              className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-navy dark:text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2">
            <p className="text-[10px] font-bold text-zinc-500 mb-2 tracking-widest">HIERARQUIA DO PROJETO</p>
            {buildingTree.map((item, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex items-center gap-2 p-2 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group text-navy dark:text-white">
                  {item.type === 'folder' ? <ChevronRight size={14} className="text-zinc-500 group-hover:text-primary" /> : <Box size={14} className="text-primary" />}
                  <span className="text-sm font-bold truncate">{item.name}</span>
                  {item.status === 'online' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full ml-auto"></div>}
                </div>
                {item.children && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-zinc-200 dark:border-white/10 pl-2">
                    {item.children.map((child, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between p-2 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <Layers size={12} />
                          <span className="text-xs truncate group-hover:text-navy dark:group-hover:text-white transition-colors">{child.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {child.warning && <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>}
                          <Eye size={12} className="text-zinc-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3D Viewer Area Placeholder */}
        <div className="flex-1 bg-zinc-100 dark:bg-[#0A0A0E] border border-zinc-200 dark:border-white/15 rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center">
          
          {/* Overlay UI (Top) */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md border border-zinc-200 dark:border-white/10 p-3 rounded-lg flex items-center gap-4 pointer-events-auto shadow-lg">
              <div>
                <p className="text-[10px] text-zinc-500">COORDENADAS</p>
                <p className="text-xs font-bold text-navy dark:text-white">X: 14.5m Y: -2.3m Z: 18.0m</p>
              </div>
              <div className="w-px h-8 bg-zinc-300 dark:bg-white/10"></div>
              <div>
                <p className="text-[10px] text-zinc-500">CLASH DETECTION</p>
                <p className="text-xs font-bold text-accent">3 COLISÕES PENDENTES</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pointer-events-auto">
              <button className="w-10 h-10 bg-white dark:bg-navy-light/80 border border-zinc-200 dark:border-white/10 rounded-lg flex items-center justify-center text-zinc-500 hover:text-navy dark:hover:text-white hover:border-primary transition-colors shadow-lg">
                <Settings size={18} />
              </button>
              <button className="w-10 h-10 bg-white dark:bg-navy-light/80 border border-zinc-200 dark:border-white/10 rounded-lg flex items-center justify-center text-zinc-500 hover:text-navy dark:hover:text-white hover:border-primary transition-colors shadow-lg">
                <ShieldCheck size={18} />
              </button>
            </div>
          </div>

          {/* Wireframe Abstract Centerpiece */}
          <div className="relative w-64 h-64 flex items-center justify-center opacity-30 dark:opacity-50">
            <motion.div 
              animate={{ rotateY: 360, rotateX: 180 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Box className="w-full h-full text-primary stroke-[0.5]" />
            </motion.div>
            <motion.div 
              animate={{ rotateY: -360, rotateZ: 180 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 scale-75"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Box className="w-full h-full text-accent stroke-[0.5]" />
            </motion.div>
          </div>
          
          <div className="absolute bottom-10 flex flex-col items-center">
             <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 tracking-widest font-sans uppercase mb-2">Visão 3D Interativa</p>
             <p className="text-[10px] text-zinc-400 bg-zinc-200 dark:bg-white/5 px-3 py-1 rounded-full border border-zinc-300 dark:border-white/10">ÁREA EM DESENVOLVIMENTO</p>
          </div>

        </div>
      </div>
    </div>
  );
}
