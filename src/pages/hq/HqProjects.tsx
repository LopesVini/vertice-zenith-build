export default function HqProjects() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🏗️</span>
      </div>
      <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">Controle de Projetos</h2>
      <p className="text-zinc-500 max-w-md">
        Em breve: Lista completa de projetos, visão em Kanban, gestão de equipe alocada e controle de orçamentos.
      </p>
    </div>
  );
}
