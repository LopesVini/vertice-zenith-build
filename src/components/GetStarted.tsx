import { useState } from "react";
import { Sparkles } from "lucide-react";

const GetStarted = () => {
  const [message, setMessage] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleProjectType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleEnhance = async () => {
    if (!message) return;
    setIsEnhancing(true);
    
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("Chave da API do Groq não encontrada no .env");
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Você é um assistente técnico de engenharia civil. O usuário vai lhe passar uma descrição de um projeto residencial que ele deseja orçar. Você deve reescrever essa descrição de forma clara, técnica, muito profissional e objetiva, mantendo todas as informações cruciais. Apenas devolva o texto refinado, nada mais. Mantenha em primeira pessoa (se o usuário usou)."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.5,
          max_tokens: 500
        })
      });

      if (!response.ok) throw new Error("Erro na API do Groq");
      
      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        setMessage(data.choices[0].message.content.trim());
      }
    } catch (error) {
      console.error("Erro ao melhorar texto com IA:", error);
      alert("Houve um problema de conexão com a IA (Groq). Verifique o console.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "radial-gradient(hsl(var(--muted-foreground)/0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      
      <div className="relative z-10 max-w-4xl mx-auto bg-background border border-border rounded-[3rem] shadow-2xl p-8 md:p-16">
        <div className="text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">Contato</span>
          <h2 className="font-sans font-extrabold text-4xl md:text-5xl text-foreground mb-4 mt-4">Iniciar Projeto</h2>
          <p className="text-muted-foreground text-lg">Fale diretamente com a equipe Vertice. Sem intermediários, direto ao ponto.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Nome completo</label>
              <input type="text" className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all" placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Telefone / WhatsApp</label>
              <input type="text" className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all" placeholder="(31) 90000-0000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Município</label>
              <select className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-foreground">
                <option value="">Selecione o município</option>
                <option value="bh">Belo Horizonte</option>
                <option value="nova-lima">Nova Lima</option>
                <option value="contagem">Contagem</option>
                <option value="outro">Outro (RMBH)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">Disciplinas Desejadas (Selecione uma ou mais)</label>
            <div className="flex flex-wrap gap-3">
              {[
                { id: "arquitetonico", label: "Arquitetônico" },
                { id: "eletrico", label: "Elétrico" },
                { id: "hidro", label: "Hidrossanitário" },
                { id: "estrutural", label: "Estrutural" },
                { id: "regularizacao", label: "Regularização / Aprovação" }
              ].map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleProjectType(type.id)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      isSelected 
                        ? 'bg-accent text-accent-foreground border-accent shadow-[0_0_15px_rgba(var(--accent),0.3)] scale-105' 
                        : 'bg-surface text-muted-foreground border-border hover:border-accent hover:text-foreground'
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-bold text-foreground">Detalhes do projeto</label>
              
              {/* Botão Melhorar com IA */}
              <button 
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || !message}
                className="flex items-center gap-2 text-xs font-bold bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-accent/10 disabled:hover:text-accent"
              >
                <Sparkles size={14} className={isEnhancing ? "animate-spin" : ""} />
                {isEnhancing ? "Melhorando..." : "Melhorar com IA"}
              </button>
            </div>
            
            <textarea 
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none" 
              placeholder="Descreva as características da residência, tamanho do terreno, número de pavimentos, necessidades especiais..." 
            />
          </div>

          <button className="w-full relative overflow-hidden bg-foreground text-background px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:scale-[1.02] transition-transform duration-300 group">
            <span className="relative z-10">Solicitar Orçamento</span>
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></div>
          </button>
        </form>
      </div>
    </section>
  );
};

export default GetStarted;
