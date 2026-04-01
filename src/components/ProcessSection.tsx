import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  { num: "01", title: "Entendimento da demanda", desc: "Analisamos suas necessidades, terreno e expectativas para definir o escopo do projeto." },
  { num: "02", title: "Desenvolvimento do projeto", desc: "Criamos as soluções técnicas com clareza, detalhamento e foco na execução." },
  { num: "03", title: "Ajustes e compatibilização", desc: "Revisamos e integramos todas as disciplinas para eliminar conflitos." },
  { num: "04", title: "Entrega organizada", desc: "Documentação completa, pronta para execução e fácil de acompanhar na obra." },
];

const ProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-primary" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">
            Nosso Processo
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mt-4">
            Método que gera confiança
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              <span className="text-accent/30 text-6xl font-extrabold">{step.num}</span>
              <h3 className="text-primary-foreground font-bold text-xl mt-2">{step.title}</h3>
              <p className="text-primary-foreground/60 mt-3 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
