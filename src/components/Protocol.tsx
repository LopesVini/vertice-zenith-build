import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    id: "01",
    title: "Concepção & Arquitetura",
    desc: "Desenvolvemos plantas, layouts e a concepção espacial da sua residência. O projeto arquitetônico é o ponto de partida — e já nasce pensando nas demais disciplinas.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 text-accent rotating-slow">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "02",
    title: "Instalações & Estrutura",
    desc: "Elétrica, hidrossanitária e estrutural — cada disciplina conduzida por um especialista da equipe, com compatibilização nativa desde o dia um. O projeto estrutural conta com profissional habilitado com registro no CREA.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 text-accent">
        <path d="M10,50 L30,50 L40,20 L60,80 L70,50 L90,50" fill="none" stroke="currentColor" strokeWidth="2" className="pulse-path" />
      </svg>
    )
  },
  {
    id: "03",
    title: "Aprovação & Regularização",
    desc: "Suporte completo nos processos junto às prefeituras da Região Metropolitana de BH. Conhecemos as normas de múltiplos municípios — seu projeto chega ao protocolo pronto para aprovação.",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 text-accent">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2" className="scanline" />
      </svg>
    )
  }
];

const Protocol = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cardsElements = gsap.utils.toArray<HTMLElement>(".protocol-card");
      
      cardsElements.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 10%",
          endTrigger: sectionRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });

        if (i > 0) {
          gsap.to(cardsElements[i - 1], {
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 20%",
              scrub: true,
            },
            scale: 0.9,
            filter: "blur(10px)",
            opacity: 0.5,
          });
        }
      });
      
      gsap.to(".rotating-slow", { rotation: 360, duration: 20, repeat: -1, ease: "linear" });
      gsap.to(".pulse-path", { strokeDashoffset: -100, strokeDasharray: "100", duration: 2, repeat: -1, ease: "linear" });
      gsap.to(".scanline", { y: 40, duration: 2, yoyo: true, repeat: -1, ease: "power1.inOut" });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="protocol" ref={sectionRef} className="relative bg-background py-24 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-24 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">Metodologia</span>
          <h2 className="font-sans font-extrabold text-4xl md:text-5xl text-foreground mt-4">Nosso Processo</h2>
          <p className="text-muted-foreground mt-4 text-lg">Do briefing à aprovação municipal — cada etapa executada por um especialista UFMG.</p>
        </div>

        <div className="relative h-[300vh]">
          {cards.map((card, i) => (
            <div 
              key={card.id} 
              className="protocol-card absolute top-0 left-0 w-full h-[80vh] bg-surface border border-border rounded-[3rem] shadow-2xl p-8 md:p-16 flex flex-col justify-between overflow-hidden"
              style={{ zIndex: i }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none mix-blend-overlay">
                {card.svg}
              </div>
              
              <div>
                <span className="font-mono text-xl md:text-2xl text-accent border border-accent/20 px-4 py-1 rounded-full">
                  {card.id}
                </span>
                <h3 className="font-sans font-bold text-3xl md:text-5xl text-foreground mt-8 max-w-xl leading-tight">
                  {card.title}
                </h3>
              </div>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg font-sans leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Protocol;
