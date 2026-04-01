import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import Footer from "@/components/Footer";

const Sobre = () => (
  <>
    <Navbar />
    <main className="pt-20">
      <AboutSection />
      <DifferentialsSection />
    </main>
    <Footer />
  </>
);

export default Sobre;
