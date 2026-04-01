import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre" className="section-padding bg-background" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">
            Sobre a Vértice
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-4 leading-tight">
            Engenharia focada em projetos residenciais bem feitos.
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mt-6">
            A Vértice nasce com o propósito de desenvolver projetos residenciais com clareza técnica, estética e foco na execução. Nossa atuação envolve arquitetura, instalações elétricas e hidrossanitárias, sempre buscando soluções organizadas, compatíveis e pensadas para o dia a dia da obra.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mt-4">
            Com base em Belo Horizonte e região, atuamos com atendimento direto, comunicação clara e atenção a cada detalhe do seu projeto.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
