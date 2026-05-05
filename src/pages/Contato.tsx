import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import GetStarted from "@/components/GetStarted";
import Footer from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Contato = () => {
  useScrollToTop();
  useEffect(() => {
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground antialiased">
      <Navbar />
      <main className="pt-20">
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
