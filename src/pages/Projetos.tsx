import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import project1 from "@/assets/project-placeholder-1.jpg";
import project2 from "@/assets/project-placeholder-2.jpg";
import project3 from "@/assets/project-placeholder-3.jpg";

const allProjects = [
  { image: project1, title: "Residência Alphaville", type: "Projeto Arquitetônico + Elétrico", desc: "Residência contemporânea com integração total entre espaços internos e externos." },
  { image: project2, title: "Casa Jardim Europa", type: "Projeto Completo", desc: "Projeto residencial com foco em iluminação natural e conforto térmico." },
  { image: project3, title: "Residência Pampulha", type: "Projeto Arquitetônico + Hidrossanitário", desc: "Residência de alto padrão com sistema hidráulico otimizado." },
  { image: project1, title: "Casa Mangabeiras", type: "Projeto Arquitetônico", desc: "Residência em terreno inclinado com aproveitamento máximo do desnível." },
  { image: project2, title: "Residência Belvedere", type: "Projeto Elétrico + Hidrossanitário", desc: "Reforma completa das instalações com adequação às normas atuais." },
  { image: project3, title: "Casa Vila da Serra", type: "Projeto Completo", desc: "Projeto integrado para residência de alto padrão em condomínio fechado." },
];

const Projetos = () => (
  <>
    <Navbar />
    <main className="pt-20">
      <section className="section-padding bg-background">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">Portfólio</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-4">
              Nossos projetos
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl">
              Conheça alguns dos projetos desenvolvidos pela Vértice. Cada trabalho reflete nosso compromisso com clareza, técnica e execução.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((proj, i) => (
              <motion.div
                key={proj.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
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
                <span className="text-accent text-xs font-semibold tracking-wider uppercase mt-4 block">{proj.type}</span>
                <h3 className="text-foreground font-bold text-xl mt-1">{proj.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{proj.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/orcamento"
              className="inline-block bg-accent text-accent-foreground px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
            >
              Solicitar orçamento
            </Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Projetos;
