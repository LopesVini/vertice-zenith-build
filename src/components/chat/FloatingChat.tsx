import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Plus, ChevronLeft, Pin, PinOff, MessageSquare } from "lucide-react";

// --- Mock Data ---
const chatList = [
  { id: 1, name: "ENGENHARIA", username: "@CARLOS", text: "FUNDAÇÕES APROVADAS", date: "HOJE", avatar: "bg-zinc-800" },
  { id: 2, name: "ARQUITETURA", username: "@MARIANA", text: "O CLIENTE QUER A SALA MAIOR", date: "MAI 6", avatar: "bg-orange-600" },
  { id: 3, name: "FINANCEIRO", username: "@VERTICE", text: "NF EMITIDA COM SUCESSO", date: "MAI 6", avatar: "bg-green-600" },
  { id: 4, name: "DIRETORIA", username: "@VERTICE", text: "AGUARDANDO APROVAÇÃO", date: "MAI 2", avatar: "bg-purple-600" },
];

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const constraintsRef = useRef(null);

  // Botão flutuante quando o chat está fechado
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:shadow-primary/50 transition-shadow"
      >
        <MessageSquare size={24} />
      </motion.button>
    );
  }

  return (
    <>
      {/* Área de restrição para o drag (toda a tela) */}
      {!isPinned && <div ref={constraintsRef} className="fixed inset-0 z-40 pointer-events-none" />}
      
      <AnimatePresence>
        <motion.div
          drag={!isPinned}
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            position: "fixed",
            ...(isPinned 
              ? { bottom: "2rem", right: "2rem" } 
              : { top: "20%", left: "50%", x: "-50%" }) // Posição inicial ao desfixar
          }}
          className={`w-[350px] bg-white dark:bg-[#151515] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col h-[500px] ${!isPinned ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          {!activeChat ? (
            // LISTA DE CHATS
            <>
              {/* Header arrastável */}
              <div className="p-4 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-[#151515]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-sm"></div>
                  <span className="font-bold font-mono text-sm tracking-widest text-navy dark:text-white pointer-events-none">ONLINE</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setIsPinned(!isPinned)} 
                    className={`p-1.5 rounded-lg transition-colors ${isPinned ? 'bg-primary/10 text-primary' : 'text-zinc-500 hover:text-navy dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/5'}`}
                    title={isPinned ? "Desafixar (Tornar Flutuante)" : "Fixar na Lateral"}
                  >
                    {isPinned ? <Pin size={16} /> : <PinOff size={16} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 text-zinc-500 hover:text-navy dark:hover:text-white transition-colors hover:bg-zinc-200 dark:hover:bg-white/5 rounded-lg">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pointer-events-auto">
                {chatList.map((chat) => (
                  <div 
                    key={chat.id} 
                    onClick={() => setActiveChat(chat.id)}
                    className="flex items-start gap-3 p-4 hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-zinc-100 dark:border-white/5 last:border-0"
                  >
                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold ${chat.avatar}`}>
                      {chat.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="flex items-baseline gap-2 truncate">
                          <span className="font-black font-sans text-navy dark:text-white tracking-tight truncate">{chat.name}</span>
                          <span className="text-[10px] font-mono text-zinc-500 truncate">{chat.username}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 flex-shrink-0 ml-2">{chat.date}</span>
                      </div>
                      <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 truncate uppercase">{chat.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-[#1A1A1A] border-t border-zinc-200 dark:border-white/5 flex justify-end pointer-events-auto">
                <div className="flex items-stretch rounded-lg overflow-hidden border border-zinc-200 dark:border-white/10 shadow-sm cursor-pointer hover:border-zinc-300 dark:hover:border-white/20 transition-colors">
                  <div className="bg-blue-600 text-white p-2 flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <div className="bg-white dark:bg-[#252525] text-navy dark:text-white px-4 py-2 font-black font-sans text-xs flex items-center">
                    NOVO CHAT
                  </div>
                </div>
              </div>
            </>
          ) : (
            // CONVERSA ATIVA
            <div className="flex flex-col h-full pointer-events-auto cursor-auto">
              <div className="p-4 bg-zinc-50 dark:bg-navy-dark border-b border-zinc-200 dark:border-white/5 flex justify-between items-center cursor-grab active:cursor-grabbing"
                   onPointerDown={(e) => {
                     // Impede que clicar em botões dentro do header dispare o drag
                     if ((e.target as HTMLElement).closest('button')) {
                       e.stopPropagation();
                     }
                   }}
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveChat(null)} className="text-zinc-500 hover:text-navy dark:hover:text-white transition-colors p-1 bg-white dark:bg-white/5 rounded-lg border border-zinc-200 dark:border-white/10">
                    <ChevronLeft size={16} />
                  </button>
                  <div className="relative">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">E</div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-navy-dark"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-sans text-navy dark:text-white">Equipe Engenharia</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">Online agora</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-navy dark:hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white dark:bg-navy-dark/50">
                <div className="flex flex-col gap-1 items-start">
                  <p className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl rounded-tl-sm px-4 py-2 text-sm max-w-[85%] text-navy dark:text-zinc-300">
                    Bom dia! As fundações foram concluídas 2 dias antes do previsto.
                  </p>
                  <span className="text-[10px] text-zinc-500 ml-1 font-mono">09:15 AM</span>
                </div>
                
                <div className="flex flex-col gap-1 items-end">
                  <p className="bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm max-w-[85%] shadow-md">
                    Excelente! Podemos avançar para a próxima etapa.
                  </p>
                  <span className="text-[10px] text-zinc-500 mr-1 font-mono">09:18 AM</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-navy-dark border-t border-zinc-200 dark:border-white/5 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Mensagem..." 
                  className="flex-1 bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 rounded-full px-4 py-2 text-sm text-navy dark:text-white focus:outline-none focus:border-primary transition-colors"
                />
                <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform">
                  <Send size={16} className="-ml-0.5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
