import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useScrollToTop } from "@/hooks/ui/useScrollToTop";

import fachadaImg from "@/assets/residencia-vebram-fachada.jpg";
import gourmetImg from "@/assets/residencia-vebram-gourmet.jpg";
import terracoImg from "@/assets/residencia-vebram-terraco.jpg";
import jantarImg from "@/assets/residencia-vebram-jantar.jpg";
import estarImg from "@/assets/residencia-vebram-estar.jpg";

const projects = [
  {
    id: 1,
    title: "Residência Vértice Contemporânea",
    category: "Projeto Completo (Arquitetura + BIM + Estrutural)",
    image: fachadaImg,
    desc: "Design contemporâneo com fachada imponente em madeira e concreto aparente, iluminação cênica e garagem ampla.",
    images: [fachadaImg, gourmetImg, terracoImg, jantarImg, estarImg],
    details: {
      clientName: "Roberto & Patrícia S.",
      testimonial: "A equipe da Vértice entregou o projeto completo de forma impecável. A compatibilização 3D BIM evitou qualquer surpresa no canteiro, gerando uma economia de cerca de 12% no custo de materiais de fundação e estrutura.",
      outcomeHighlight: "Obra concluída 15 dias antes do cronograma planejado devido à precisão do detalhamento executivo.",
      features: [
        "Área: 480m²",
        "Fachada contemporânea com brises em madeira",
        "Compatibilização BIM 3D integrada",
        "Espaço gourmet completo com área de jogos",
        "Terraço suíte master com vista panorâmica"
      ]
    }
  },
  {
    id: 2,
    title: "Espaço Gourmet & Lazer Residencial",
    category: "Projeto Arquitetônico & Interiores",
    image: gourmetImg,
    desc: "Área externa integrada com bancada gourmet, salão de jogos com mesa de sinuca e revestimento em pedra natural.",
    images: [gourmetImg, fachadaImg, terracoImg, jantarImg, estarImg],
    details: {
      clientName: "Construtora Horizonte",
      testimonial: "A integração dos ambientes sociais e o cálculo de vãos livres foram perfeitos. O ambiente atende perfeitamente ao conceito de receber bem.",
      outcomeHighlight: "Aproveitamento de 100% da área externa com integração total entre churrasqueira e varanda.",
      features: [
        "Vãos livres otimizados",
        "Integração interna-externa",
        "Paredes revestidas em pedra filetada",
        "Iluminação embutida direcionada"
      ]
    }
  },
  {
    id: 3,
    title: "Suíte Master & Terraço Suíte",
    category: "Projeto de Interiores & Cobertura",
    image: terracoImg,
    desc: "Terraço superior privativo com deck, iluminação indireta balizadora e guarda-corpo em vidro temperado.",
    images: [terracoImg, fachadaImg, gourmetImg, jantarImg, estarImg],
    details: {
      clientName: "Cláudio & Heloísa M.",
      testimonial: "O terraço da suíte master virou nosso refúgio diário. O projeto de iluminação noturna e o acabamento dos materiais ficaram espetaculares.",
      outcomeHighlight: "Máxima privacidade e conforto térmico no pavimento superior.",
      features: [
        "Deck elevado em porcelanato antiderrapante",
        "Paisagismo integrado com floreiras",
        "Guarda-corpo panorâmico em vidro",
        "Portas de correr com esquadrias de alto desempenho"
      ]
    }
  },
  {
    id: 4,
    title: "Living & Sala de Jantar Integrada",
    category: "Projeto de Interiores & Iluminação",
    image: jantarImg,
    desc: "Ambiente social amplo com mesa de jantar em madeira maciça, grandes panos de vidro e iluminação suave de teto.",
    images: [jantarImg, estarImg, fachadaImg, gourmetImg, terracoImg],
    details: {
      clientName: "Família Vasconcellos",
      testimonial: "A sensação de amplitude da sala de jantar com integração ao jardim de inverno é incrível. O conforto acústico e térmico superou nossas expectativas.",
      outcomeHighlight: "Integração total dos ambientes de convivência familiar.",
      features: [
        "Piso em porcelanato acetinado grande formato",
        "Esquadrias do piso ao teto",
        "Iluminação em LED quente (3000K)",
        "Integração com jardim interno"
      ]
    }
  }
];

const Projetos = () => {
  useScrollToTop();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for gallery modal
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".project-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openProjectDetails = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setActiveImageIndex(0);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject) return;
    setActiveImageIndex((prev) => (prev + 1) % selectedProject.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject) return;
    setActiveImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
  };

  return (
    <div className="bg-background min-h-screen text-foreground antialiased selection:bg-accent/30 selection:text-accent-foreground">
      <Navbar />
      
      <main className="pt-28 pb-16 md:pt-40 md:pb-32 px-6 md:px-12 lg:px-24 min-h-[90vh]">
        <div className="max-w-7xl mx-auto" ref={containerRef}>
          <div className="mb-10 md:mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">Portfólio</span>
            <h1 className="font-sans font-extrabold text-4xl md:text-5xl lg:text-6xl mt-4 text-foreground leading-tight">
              Obras que assinam <br/>nossa precisão.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl">
              Confira alguns de nossos projetos modelo. Clique em qualquer projeto para ver mais fotos reais dos resultados finais e depoimentos de nossos clientes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card group cursor-pointer"
                onClick={() => openProjectDetails(project)}
              >
                <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3] bg-surface mb-4 md:mb-6 border border-border">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy-dark/0 group-hover:bg-navy-dark/40 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      <ArrowUpRight size={28} />
                    </div>
                  </div>
                </div>
                
                <div className="px-2">
                  <span className="font-mono text-xs text-accent uppercase tracking-widest">{project.category}</span>
                  <h3 className="font-sans font-bold text-xl md:text-2xl text-foreground mt-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    {project.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Gallery & Showcase Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-6xl h-[90vh] md:h-5/6 lg:aspect-[16/9] lg:h-auto bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row z-10"
            >
              {/* Left / Top Side: Main Image Viewer */}
              <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden h-[45vh] md:h-full group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={selectedProject.images[activeImageIndex]}
                    alt={`${selectedProject.title} - Foto ${activeImageIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover select-none"
                  />
                </AnimatePresence>

                {/* Left Arrow */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/45 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:outline-none"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/45 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:outline-none"
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Counter Badge */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 text-white font-mono text-xs px-3 py-1.5 rounded-full select-none">
                  {activeImageIndex + 1} / {selectedProject.images.length}
                </div>
              </div>

              {/* Right / Bottom Side: Project Info & Quality Highlights */}
              <div className="w-full md:w-[400px] lg:w-[460px] shrink-0 border-t md:border-t-0 md:border-l border-zinc-800 p-6 md:p-8 flex flex-col justify-between bg-zinc-900/40 overflow-y-auto h-[45vh] md:h-full text-left">
                
                {/* Header & Description */}
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">
                        {selectedProject.category}
                      </span>
                      <h2 className="font-sans font-black text-2xl text-white mt-1">
                        {selectedProject.title}
                      </h2>
                    </div>
                    
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-2 rounded-full bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Fechar"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-sans">
                    {selectedProject.desc}
                  </p>

                  {/* Highlights section (Quality focused) */}
                  <div className="mt-6 pt-5 border-t border-zinc-800">
                    <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-accent flex items-center gap-1.5 mb-3">
                      <Sparkles size={12} className="text-accent" />
                      Resultado Final & Qualidade
                    </h4>
                    
                    <div className="bg-accent/5 border border-accent/15 rounded-2xl p-4 mb-4">
                      <span className="block text-[10px] font-bold font-mono text-accent uppercase tracking-wider mb-1">
                        Destaque da Entrega
                      </span>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        {selectedProject.details.outcomeHighlight}
                      </p>
                    </div>

                    {/* Testimonial */}
                    <div className="relative pl-4 border-l-2 border-accent/40 italic text-zinc-300 text-xs leading-relaxed my-4">
                      <span className="absolute -left-1 -top-2 text-3xl font-serif text-accent/20 select-none">“</span>
                      {selectedProject.details.testimonial}
                      <span className="block not-italic text-[10px] font-mono text-zinc-500 font-bold tracking-widest mt-2 uppercase">
                        — Cliente: {selectedProject.details.clientName}
                      </span>
                    </div>

                    {/* Technical details list */}
                    <ul className="space-y-2 mt-4 text-[11px] text-zinc-400 font-sans">
                      {selectedProject.details.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-accent shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Thumbnails list */}
                <div className="mt-8 pt-5 border-t border-zinc-800">
                  <span className="block text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider mb-3">
                    Mais Fotos do Projeto
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-800">
                    {selectedProject.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative aspect-video w-20 rounded-lg overflow-hidden border shrink-0 transition-all ${
                          idx === activeImageIndex
                            ? "border-accent ring-2 ring-accent/30 scale-[1.03]"
                            : "border-zinc-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Miniatura ${idx + 1}`}
                          className="w-full h-full object-cover select-none"
                        />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Projetos;
