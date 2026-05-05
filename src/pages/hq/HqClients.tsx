export default function HqClients() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">👥</span>
      </div>
      <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">Gestão de Clientes</h2>
      <p className="text-zinc-500 max-w-md">
        Em breve: CRM integrado, histórico de interações, gestão de faturas e documentação do cliente.
      </p>
    </div>
  );
}
