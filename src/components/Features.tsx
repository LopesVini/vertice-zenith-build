import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MousePointer2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Card 1: Diagnostic Shuffler ─── */
const ShufflerCard = () => {
  const [items, setItems] = useState([
    { id: 1, label: "Projeto Arquitetônico" },
    { id: 2, label: "Projeto Elétrico" },
    { id: 3, label: "Projeto Hidrossanitário" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const newArr = [...prev];
        const last = newArr.pop();
        if (last) newArr.unshift(last);
        return newArr;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface border border-border rounded-[2rem] p-8 shadow-2xl relative h-80 flex flex-col justify-between overflow-hidden">
      <div>
        <h3 className="font-sans font-bold text-2xl text-foreground">Projetos Integrados</h3>
        <p className="text-muted-foreground text-sm mt-2">Todas as disciplinas compatibilizadas num único lugar — da arquitetura às instalações.</p>
      </div>
      
      <div className="relative h-32 w-full mt-8">
        {items.map((item, index) => {
          const isTop = index === 0;
          return (
            <div 
              key={item.id}
              className="absolute w-full p-4 rounded-xl border border-border/50 bg-background shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-between"
              style={{
                top: `${index * 12}px`,
                scale: 1 - index * 0.05,
                zIndex: 10 - index,
                opacity: 1 - index * 0.2,
                borderColor: isTop ? 'hsl(var(--accent))' : ''
              }}
            >
              <span className="font-mono text-sm text-foreground/80">{item.label}</span>
              {isTop && <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Card 2: Telemetry Typewriter ─── */
const TypewriterCard = () => {
  const lines = [
    "> Verificando normas municipais...",
    "> Município: BH — Código de Obras OK",
    "> Checklist normativo: 12/12 itens ✓",
    "> Documentação pronta para protocolo.",
    "> Status: Aprovação facilitada."
  ];
  const fullText = lines.join("\n");
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        setTimeout(() => { i = 0; }, 2000);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface border border-border rounded-[2rem] p-8 shadow-2xl h-80 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-sans font-bold text-2xl text-foreground">Aprovação Municipal</h3>
          <p className="text-muted-foreground text-sm mt-2">Checklists normativos automatizados por município da RMBH.</p>
        </div>
        <div className="flex items-center gap-2 bg-navy-dark text-white px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="font-mono text-xs uppercase tracking-widest">Live</span>
        </div>
      </div>
      
      <div className="bg-navy-dark rounded-xl p-4 h-32 overflow-hidden relative">
        <pre className="font-mono text-xs md:text-sm text-green-400 whitespace-pre-wrap">
          {displayed}
          <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse"></span>
        </pre>
      </div>
    </div>
  );
};

/* ─── Card 3: Cursor Protocol Scheduler ─── */
const SchedulerCard = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      
      tl.set(".cursor-icon", { x: 0, y: 0, scale: 1, opacity: 1 })
        .to(".cursor-icon", { x: 80, y: 30, duration: 1, ease: "power2.inOut" })
        .to(".cursor-icon", { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to(".day-cell-active", { backgroundColor: "hsl(var(--accent))", color: "white", duration: 0.2 }, "-=0.1")
        .to(".cursor-icon", { x: 220, y: 80, duration: 1, ease: "power2.inOut", delay: 0.5 })
        .to(".cursor-icon", { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to(".save-btn", { backgroundColor: "hsl(var(--accent))", color: "white", scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 }, "-=0.1")
        .to(".cursor-icon", { opacity: 0, duration: 0.5, delay: 0.5 })
        .set(".day-cell-active", { backgroundColor: "transparent", color: "hsl(var(--foreground))" })
        .to(".cursor-icon", { opacity: 1, x: 0, y: 0, duration: 0.5 });
        
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-surface border border-border rounded-[2rem] p-8 shadow-2xl h-80 flex flex-col justify-between" ref={container}>
      <div>
        <h3 className="font-sans font-bold text-2xl text-foreground">Inovação Digital</h3>
        <p className="text-muted-foreground text-sm mt-2">Ferramentas e plugins que automatizam o fluxo de trabalho da engenharia.</p>
      </div>
      
      <div className="relative mt-6 border border-border rounded-xl p-4 bg-background">
        <div className="flex justify-between font-mono text-xs mb-4 text-muted-foreground">
          <span>S</span><span>M</span><span>T</span><span className="day-cell-active px-2 rounded transition-all">W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div className="flex justify-end">
          <button className="save-btn font-mono text-xs px-4 py-1 border border-border rounded transition-all">Gerar Checklist</button>
        </div>
        
        <div className="cursor-icon absolute top-0 left-0 text-foreground drop-shadow-md z-10">
          <MousePointer2 fill="currentColor" size={20} />
        </div>
      </div>
    </div>
  );
};

/* ─── Main Features Section ─── */
const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-32 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">Serviços & Inovação</span>
          <h2 className="font-sans font-extrabold text-4xl md:text-5xl mt-4 text-foreground leading-tight">
            Engenharia completa num único lugar.
          </h2>
          <p className="text-muted-foreground text-lg mt-4">
            Cada sócio é especialista em uma disciplina. O resultado: projetos que nascem integrados, sem retrabalho.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="feature-card"><ShufflerCard /></div>
          <div className="feature-card"><TypewriterCard /></div>
          <div className="feature-card"><SchedulerCard /></div>
        </div>
      </div>
    </section>
  );
};

export default Features;
