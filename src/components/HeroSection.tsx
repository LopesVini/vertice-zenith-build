import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heroImage from "@/assets/hero-blueprint.jpg";
import logo from "@/assets/logo-vertice.png";

const rotatingPhrases = [
  "Menos erros.",
  "Mais clareza.",
  "Mais segurança.",
  "Mais organização.",
  "Mais confiança.",
];

const HeroSection = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % rotatingPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-primary overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Projeto arquitetônico residencial"
          className="w-full h-full object-cover opacity-[0.07]"
          width={1920}
          height={1080}
        />
      </div>

      <div className="relative z-10 container-tight px-6 py-32 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >

            {/* Rotating phrase */}
            <div className="h-10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPhrase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="block text-accent text-lg md:text-xl font-semibold tracking-wide"
                >
                  {rotatingPhrases[currentPhrase]}
                </motion.span>
              </AnimatePresence>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-primary-foreground tracking-tight">
              Projetos residenciais com técnica, clareza e segurança para sua obra.
            </h1>

            <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed max-w-xl">
              Desenvolvemos projetos arquitetônicos, elétricos e hidrossanitários para residências com foco em execução real, compatibilização e atendimento claro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/orcamento"
                className="bg-accent text-accent-foreground px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity text-center shadow-lg shadow-accent/20"
              >
                Solicitar orçamento
              </Link>
              <Link
                to="/projetos"
                className="border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-foreground/10 transition-colors text-center"
              >
                Ver portfólio
              </Link>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <img
              src={heroImage}
              alt="Desenho técnico de projeto residencial"
              className="w-full rounded-2xl shadow-2xl"
              width={1920}
              height={1080}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
