import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { PenTool, Zap, Droplets, Layers, HelpCircle, Building2 } from "lucide-react";

const services = [
  {
    icon: PenTool,
    title: "Projeto Arquitetônico",
    desc: "Desenvolvimento de soluções funcionais e estéticas para residências, do conceito à documentação executiva.",
  },
  {
    icon: Building2,
    title: "Projeto Estrutural",
    desc: "Dimensionamento estrutural conduzido por engenheiro com CREA e experiência em estruturas de grande porte — pontes e obras que exigem cálculo preciso e responsabilidade técnica elevada. Esse mesmo padrão aplicado à sua residência.",
  },
  {
    icon: Zap,
    title: "Projeto Elétrico",
    desc: "Projeto elétrico com foco em segurança, organização e eficiência para o dia a dia da sua casa.",
  },
  {
    icon: Droplets,
    title: "Projeto Hidrossanitário",
    desc: "Sistema hidrossanitário pensado para desempenho, praticidade e conformidade com normas técnicas.",
  },
  {
    icon: Layers,
    title: "Compatibilização",
    desc: "Integração entre todas as disciplinas do projeto, evitando conflitos e retrabalho na obra.",
  },
  {
    icon: HelpCircle,
    title: "Consultoria Técnica",
    desc: "Orientação especializada para decisões técnicas e revisão de projetos existentes.",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="servicos" className="section-padding bg-background" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">
            Serviços
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-4">
            O que a Vértice faz por você
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group border border-border rounded-xl p-8 hover:border-accent/40 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-5">
                <svc.icon className="text-accent" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-foreground font-bold text-xl">{svc.title}</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/orcamento"
            className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
          >
            Solicitar orçamento
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
