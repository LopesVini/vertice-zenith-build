import { FileText, CheckCircle, Clock, Download, ArrowRight, MessageSquare } from "lucide-react";

const revisions = [
  {
    id: 1,
    title: "Projeto Executivo - Estrutural Rev 02",
    date: "10 MAIO 2026 - 14:30",
    status: "approved", // approved, pending, revision
    description: "Revisão contemplando as alterações no posicionamento dos pilares da fachada sul, conforme alinhamento com a arquitetura.",
    files: ["STR_REV02_PLANTA.pdf", "STR_REV02_MEMORIA.pdf", "STR_REV02_IFC.zip"],
    author: "Carlos Eng."
  },
  {
    id: 2,
    title: "Projeto Legal - Arquitetura Rev 01",
    date: "05 MAIO 2026 - 09:15",
    status: "pending",
    description: "Conjunto de pranchas preparado para submissão na prefeitura. Aguardando assinatura digital do proprietário.",
    files: ["ARQ_LEGAL_COMPLETO.pdf", "FORMULARIO_PREFEITURA.pdf"],
    author: "Mariana Arq."
  },
  {
    id: 3,
    title: "Estudo Preliminar - Instalações",
    date: "28 ABRIL 2026 - 16:45",
    status: "revision",
    description: "Estudo de viabilidade das prumadas hidráulicas. Cliente solicitou alteração no layout dos banheiros da suíte master.",
    files: ["MEP_ESTUDO_PRELIMINAR.pdf"],
    author: "Equipe MEP"
  }
];

export default function ProjectUpdates() {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full font-mono text-zinc-300 relative gap-6 max-w-[1200px] mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-zinc-200 dark:border-white/5 pb-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="bg-accent/20 text-accent px-3 py-1 rounded-[0.25rem] font-bold text-sm">
            [ LOG ]
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-navy dark:text-white uppercase font-sans">
            Registro de Entregas
          </h1>
        </div>
        <div className="hidden sm:flex gap-2">
          <div className="flex items-center gap-2 text-xs font-bold px-3 border-r border-zinc-200 dark:border-white/10 text-navy dark:text-zinc-400">
            <CheckCircle size={14} className="text-green-500" /> APROVADOS (12)
          </div>
          <div className="flex items-center gap-2 text-xs font-bold px-3 text-navy dark:text-zinc-400">
            <Clock size={14} className="text-accent" /> PENDENTES (1)
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        <div className="relative border-l-2 border-zinc-200 dark:border-white/10 ml-4 space-y-12 pb-8 mt-4">
          
          {revisions.map((rev) => (
            <div key={rev.id} className="relative pl-8">
              
              {/* Timeline Dot */}
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-zinc-50 dark:border-navy-dark flex items-center justify-center
                ${rev.status === 'approved' ? 'bg-green-500' : rev.status === 'pending' ? 'bg-accent' : 'bg-primary'}`}
              ></div>
              
              {/* Content Card */}
              <div className="bg-white dark:bg-navy-light/60 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:border-zinc-300 dark:hover:border-white/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-black font-sans text-navy dark:text-white">{rev.title}</h2>
                      {rev.status === 'approved' && <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-green-500/20">Aprovado</span>}
                      {rev.status === 'pending' && <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-accent/20">Ação Requerida</span>}
                      {rev.status === 'revision' && <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-primary/20">Em Revisão</span>}
                    </div>
                    <p className="text-xs text-zinc-500">{rev.date} • <span className="text-navy dark:text-zinc-300">Publicado por {rev.author}</span></p>
                  </div>
                  
                  {rev.status === 'pending' && (
                    <button className="bg-accent text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-accent/90 transition-colors flex items-center gap-2 shadow-md">
                      APROVAR ENTREGA <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-sans">
                  {rev.description}
                </p>

                <div className="bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-xl p-4">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-500 mb-3 uppercase">Arquivos Anexados ({rev.files.length})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rev.files.map((file, fIdx) => (
                      <div key={fIdx} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-lg group hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText size={16} className="text-primary shrink-0" />
                          <span className="text-xs text-navy dark:text-zinc-300 truncate font-bold">{file}</span>
                        </div>
                        <Download size={14} className="text-zinc-400 group-hover:text-primary shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/5 flex gap-4">
                  <button className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors flex items-center gap-2">
                    <MessageSquare size={14} /> 2 COMENTÁRIOS
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
