import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const phases = ["Ideia", "Anteprojeto", "Projeto", "Obra", "Reforma", "Regularização"];
const projectTypes = ["Projeto Arquitetônico", "Projeto Elétrico", "Projeto Hidrossanitário", "Compatibilização", "Consultoria Técnica"];

const QuoteSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const { error: dbError } = await supabase.from("Orçamentos").insert({
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      celular: formData.get("celular") as string,
      cidade: formData.get("cidade") as string,
      tipo: formData.get("tipo") as string,
      area: formData.get("area") as string,
      fase: formData.get("fase") as string,
      mensagem: formData.get("mensagem") as string,
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
                <div className="grid sm:grid-cols-2 gap-5">
                  <select
                    name="tipo"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="">Tipo de projeto</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    name="area"
                    type="text"
                    placeholder="Área aproximada (m²)"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
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
                <textarea
                  name="mensagem"
                  placeholder="Mensagem (opcional)"
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                />
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
