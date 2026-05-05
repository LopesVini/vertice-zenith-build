import { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import { Loader2, Cuboid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThreeDViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Inicializando motor gráfico...");

  useEffect(() => {
    if (!containerRef.current) return;

    let components: OBC.Components;

    const initEngine = async () => {
      try {
        setLoadingText("Configurando ambiente 3D...");
        
        // Inicialização do Engine (@thatopen/components)
        components = new OBC.Components();
        
        const worlds = components.get(OBC.Worlds);
        const world = worlds.create<
          OBC.SimpleScene,
          OBC.SimpleCamera,
          OBC.SimpleRenderer
        >();

        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBC.SimpleRenderer(components, containerRef.current!);
        world.camera = new OBC.SimpleCamera(components);

        components.init();

        world.scene.setup();
        world.camera.controls.setLookAt(12, 12, 12, 0, 0, 0);

        // Adicionando um Grid para referência visual
        const grids = components.get(OBC.Grids);
        grids.create(world);

        // Adicionando uma caixa de exemplo para provar que o motor 3D está vivo no MVP
        // Num cenário real, aqui usaríamos o OBC.IfcLoader para baixar o arquivo do Supabase
        const material = new OBC.THREE.MeshStandardMaterial({ 
          color: 0x2E4036, // Cor Primária do Preset
          roughness: 0.2,
          metalness: 0.8
        });
        const geometry = new OBC.THREE.BoxGeometry(3, 3, 3);
        const cube = new OBC.THREE.Mesh(geometry, material);
        cube.position.set(0, 1.5, 0);
        world.scene.three.add(cube);

        // Luzes
        const ambientLight = new OBC.THREE.AmbientLight(0xffffff, 0.5);
        world.scene.three.add(ambientLight);
        const directionalLight = new OBC.THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        world.scene.three.add(directionalLight);

        setLoadingText("Renderizando modelo BIM...");
        
        // Simular um tempo de carregamento para efeito cinematográfico
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);

      } catch (error) {
        console.error("Erro ao inicializar 3D Viewer:", error);
        setLoadingText("Falha ao carregar o modelo.");
      }
    };

    initEngine();

    // Cleanup: Descartar a cena ao desmontar o componente para evitar memory leaks
    return () => {
      if (components) {
        components.dispose();
      }
    };
  }, []);

  return (
    <div className="w-full h-[calc(100vh-8rem)] min-h-[600px] relative rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
      {/* Container do Canvas 3D */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Interface de Controles/Informação Sobreposta */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <Cuboid className="w-5 h-5 text-primary" />
            <div>
              <p className="text-white font-medium text-sm">Residência Alphaville</p>
              <p className="text-zinc-400 text-xs font-mono">MODELO ESTRUTURAL v2.4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tela de Loading Cinematográfica */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-10 bg-[#0A0A0A] flex flex-col items-center justify-center backdrop-blur-xl"
          >
            {/* Efeito de Scanner/Grade de Fundo no Loading */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

            <div className="relative flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h3 className="text-white text-lg tracking-widest font-light mb-2">
                  INICIALIZANDO VIEWER
                </h3>
                <p className="text-zinc-500 font-mono text-sm">
                  {loadingText}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
