import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Contato = () => (
  <>
    <Navbar />
    <main className="pt-20">
      <ContactSection />
      <FAQSection />
    </main>
    <Footer />
  </>
);

export default Contato;
