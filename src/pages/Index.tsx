import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DifferentialsSection from "@/components/DifferentialsSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import PortfolioSection from "@/components/PortfolioSection";
import QuoteSection from "@/components/QuoteSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <AboutSection />
      <DifferentialsSection />
      <ServicesSection />
      <ProcessSection />
      <PortfolioSection />
      <QuoteSection />
      <FAQSection />
      <ContactSection />
    </main>
    <Footer />
  </>
);

export default Index;
