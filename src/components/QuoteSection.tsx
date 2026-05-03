import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MessageCircle, Sparkles, Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

const phases = ["Ideia", "Anteprojeto", "Projeto", "Obra", "Reforma", "Regularização"];
const projectTypes = [
  "Projeto Arquitetônico",
  "Projeto Estrutural",
  "Projeto Elétrico",
  "Projeto Hidrossanitário",
  "Compatibilização",
  "Consultoria Técnica",
];

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string;

async function improveText(text: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Corrija erros de português e melhore a coesão do texto a seguir, mantendo o sentido original e o tom do autor. Retorne apenas o texto corrigido, sem explicações.\n\n${text}`,
        },
      ],
      temperature: 0.3,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? text;
}

const QuoteSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [improvingText, setImprovingText] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleImprove = async () => {
    if (!mensagem.trim() || improvingText) return;
    setImprovingText(true);
    try {
      const improved = await improveText(mensagem);
      setMensagem(improved);
    } catch {
      // silently fail — user's original text stays
    } finally {
      setImprovingText(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTypes.length === 0) {
      setError("Selecione ao menos um tipo de projeto.");
      return;
    }
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const { error: dbError } = await supabase.from("Orçamentos").insert({
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      celular: formData.get("celular") as string,
      cidade: formData.get("cidade") as string,
      tipo: selectedTypes.join(", "),
      area: formData.get("area") as string,
      fase: formData.get("fase") as string,
      mensagem,
    });

    setLoading(false);

    if (dbError) {
      setError("Erro ao enviar. Tente novamente.");
      console.error(dbError);
      return;
    }

    setSubmitted(true);
  };

  return (
    <section id="orcamento" className="section-padding bg-background" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-16"
        >
          {/* Form */}
          <div>
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Orçamento
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4">
              Peça seu orçamento
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Preencha o formulário abaixo e retornamos em até 24 horas.
            </p>

            {submitted ? (
              <div className="mt-8 p-8 bg-accent/5 rounded-xl border border-accent/20 text-center">
                <h3 className="text-foreground text-xl font-bold">Solicitação enviada!</h3>
                <p className="text-muted-foreground mt-2">Entraremos em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    name="nome"
                    type="text"
                    placeholder="Nome"
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    required
                    maxLength={255}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    name="celular"
                    type="tel"
                    placeholder="WhatsApp"
                    required
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <input
                    name="cidade"
                    type="text"
                    placeholder="Cidade"
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>

                {/* Multi-select tipo de projeto */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tipo de projeto <span className="text-accent">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => {
                      const selected = selectedTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleType(type)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            selected
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-foreground"
                          }`}
                        >
                          {selected && <Check size={13} strokeWidth={2.5} />}
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    name="area"
                    type="text"
                    placeholder="Área aproximada (m²)"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <select
                    name="fase"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="">Fase atual do projeto</option>
                    {phases.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Textarea com botão IA */}
                <div className="relative">
                  <textarea
                    name="mensagem"
                    placeholder="Mensagem (opcional)"
                    rows={4}
                    maxLength={1000}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none pb-10"
                  />
                  {mensagem.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={handleImprove}
                      disabled={improvingText}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-xs text-accent hover:opacity-70 transition-opacity disabled:opacity-40"
                    >
                      {improvingText ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      {improvingText ? "Melhorando..." : "Melhorar com IA"}
                    </button>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent/20 disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar solicitação"}
                </button>
              </form>
            )}
          </div>

          {/* Side CTA */}
          <div className="flex flex-col justify-center">
            <div className="bg-primary rounded-2xl p-10 text-center">
              <MessageCircle className="text-accent mx-auto mb-4" size={48} strokeWidth={1.5} />
              <h3 className="text-primary-foreground text-2xl font-bold">
                Prefere falar agora?
              </h3>
              <p className="text-primary-foreground/60 mt-3 text-lg">
                Tire suas dúvidas diretamente pelo WhatsApp.
              </p>
              <a
                href="https://wa.me/5531985981606?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg text-lg font-bold mt-6 hover:opacity-90 transition-opacity"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuoteSection;
