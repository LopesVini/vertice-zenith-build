import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Mail, Instagram, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contato" className="section-padding bg-primary" ref={ref}>
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">
            Contato
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mt-4">
            Fale com a Vértice
          </h2>
          <p className="text-primary-foreground/60 text-lg mt-4 max-w-xl mx-auto">
            Tire seu projeto do papel. Solicite seu orçamento ou fale diretamente com a nossa equipe.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <a
            href="https://wa.me/5531985981606?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-8 hover:bg-primary-foreground/10 transition-colors"
          >
            <MessageCircle className="text-accent" size={32} />
            <span className="text-primary-foreground font-bold">WhatsApp</span>
            <span className="text-primary-foreground/60 text-sm">(31) 98598-1606</span>
          </a>

          <a
            href="mailto:verticeprojetos7@gmail.com"
            className="flex flex-col items-center gap-3 bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-8 hover:bg-primary-foreground/10 transition-colors"
          >
            <Mail className="text-accent" size={32} />
            <span className="text-primary-foreground font-bold">E-mail</span>
            <span className="text-primary-foreground/60 text-sm">verticeprojetos7@gmail.com</span>
          </a>

          <a
            href="https://instagram.com/projetos.vertice"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-8 hover:bg-primary-foreground/10 transition-colors"
          >
            <Instagram className="text-accent" size={32} />
            <span className="text-primary-foreground font-bold">Instagram</span>
            <span className="text-primary-foreground/60 text-sm">@projetos.vertice</span>
          </a>

          <div className="flex flex-col items-center gap-3 bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-8">
            <MapPin className="text-accent" size={32} />
            <span className="text-primary-foreground font-bold">Localização</span>
            <span className="text-primary-foreground/60 text-sm text-center">Belo Horizonte e região metropolitana</span>
          </div>
        </motion.div>

        <div className="text-center">
          <Link
            to="/orcamento"
            className="inline-block bg-accent text-accent-foreground px-10 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
          >
            Solicitar orçamento
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
