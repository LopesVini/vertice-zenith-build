import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";

const Servicos = () => (
  <>
    <Navbar />
    <main className="pt-20">
      <ServicesSection />
      <ProcessSection />
    </main>
    <Footer />
  </>
);

export default Servicos;
