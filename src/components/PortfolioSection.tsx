import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import project1 from "@/assets/project-placeholder-1.jpg";
import project2 from "@/assets/project-placeholder-2.jpg";
import project3 from "@/assets/project-placeholder-3.jpg";

const projects = [
  { image: project1, title: "Residência Alphaville", type: "Projeto Arquitetônico + Elétrico", desc: "Residência contemporânea com integração total entre espaços internos e externos." },
  { image: project2, title: "Casa Jardim Europa", type: "Projeto Completo", desc: "Projeto residencial com foco em iluminação natural e conforto térmico." },
  { image: project3, title: "Residência Pampulha", type: "Projeto Arquitetônico + Hidrossanitário", desc: "Residência de alto padrão com sistema hidráulico otimizado." },
];

const PortfolioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projetos" className="section-padding bg-surface" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4"
        >
          <div>
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Portfólio
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-4">
              Projetos que falam por nós
            </h2>
          </div>
          <Link
            to="/projetos"
            className="text-accent font-semibold flex items-center gap-2 hover:gap-3 transition-all"
          >
            Ver todos <ArrowRight size={18} />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <span className="text-accent text-xs font-semibold tracking-wider uppercase mt-4 block">
                {proj.type}
              </span>
              <h3 className="text-foreground font-bold text-xl mt-1">{proj.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{proj.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
