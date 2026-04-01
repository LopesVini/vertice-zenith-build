import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Quais serviços a Vértice realiza?", a: "Desenvolvemos projetos arquitetônicos, elétricos, hidrossanitários, compatibilização entre disciplinas e consultoria técnica, com foco em residências." },
  { q: "Vocês atendem quais cidades?", a: "Atendemos Belo Horizonte e toda a região metropolitana, além de cidades do interior de Minas Gerais com atendimento remoto." },
  { q: "Como funciona o orçamento?", a: "Basta preencher o formulário no site ou nos chamar no WhatsApp. Analisamos sua demanda e enviamos uma proposta detalhada em até 24 horas." },
  { q: "Vocês fazem compatibilização?", a: "Sim. A compatibilização é parte essencial do nosso processo, garantindo que todas as disciplinas funcionem de forma integrada." },
  { q: "Vocês atendem projetos residenciais de qual porte?", a: "Atendemos desde residências compactas até projetos de médio e alto padrão, sempre com o mesmo nível de atenção e qualidade." },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-surface" ref={ref}>
      <div className="container-tight max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4">
            Perguntas frequentes
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-surface-elevated border border-border rounded-xl px-6"
              >
                <AccordionTrigger className="text-foreground font-semibold text-left text-base hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
