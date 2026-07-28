import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellRing, BellOff, CheckCheck } from "lucide-react";
import {
  useNotifications,
  timeAgo,
  type AppNotification,
} from "@/hooks/data/useNotifications";
import { usePushNotifications } from "@/hooks/data/usePushNotifications";

// Sino de notificações compartilhado entre o HQ (admin) e o Portal (cliente).
// O hook useNotifications já traz só as notificações do usuário logado (RLS),
// então o mesmo componente serve para os dois lados sem mudança.
//
// `align` controla de que lado o dropdown abre no desktop:
//  - "right" (padrão): âncora à direita — usado no header do HQ.
//  - "left": âncora à esquerda — usado na sidebar do Portal, para o dropdown
//    abrir para dentro da tela em vez de sair pela borda esquerda.
export default function NotificationBell({
  align = "right",
}: {
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const push = usePushNotifications();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpen(n: AppNotification) {
    markRead(n.id);
    if (n.link) {
      setOpen(false);
      navigate(n.link);
    }
    // Chat não tem rota própria: além de ir para a área, abre o widget.
    if (n.type === "message") {
      setOpen(false);
      window.dispatchEvent(new CustomEvent("open-chat"));
    }
  }

  const desktopAnchor = align === "left" ? "lg:left-0" : "lg:right-0";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 lg:w-10 lg:h-10 bg-white dark:bg-navy-light/40 border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-navy dark:hover:text-white transition-colors shadow-sm relative"
        aria-label="Notificações"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-navy-dark" />
        )}
      </button>

      {open && (
        <div
          className={`fixed inset-x-3 top-16 w-auto lg:absolute lg:inset-x-auto ${desktopAnchor} lg:top-12 lg:w-80 bg-white dark:bg-navy-light border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-white/5">
            <span className="font-bold text-sm text-navy dark:text-white">Notificações</span>
            <div className="flex items-center gap-3">
              {/* Ativar/desativar push (site fechado) neste aparelho */}
              {push.supported && push.permission !== "denied" && (
                <button
                  onClick={push.subscribed ? push.unsubscribe : push.subscribe}
                  disabled={push.loading}
                  title={
                    push.subscribed
                      ? "Desativar notificações neste aparelho"
                      : "Ativar notificações neste aparelho"
                  }
                  className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-navy dark:hover:text-white disabled:opacity-50"
                >
                  {push.subscribed ? <BellOff size={13} /> : <BellRing size={13} />}
                  <span className="hidden sm:inline">{push.subscribed ? "Desativar" : "Ativar"}</span>
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-semibold"
                >
                  <CheckCheck size={13} /> Ler todas
                </button>
              )}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-white/5">
            {notifications.length === 0 && (
              <p className="text-xs text-zinc-400 text-center py-8 px-4">
                Nenhuma notificação por aqui ainda.
              </p>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleOpen(n)}
                className={`flex gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5 ${
                  n.link ? "cursor-pointer" : "cursor-default"
                } ${!n.read_at ? "bg-blue-50/50 dark:bg-blue-500/5" : ""}`}
              >
                <div
                  className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    n.read_at ? "bg-zinc-300 dark:bg-zinc-600" : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold truncate ${
                      n.read_at ? "text-zinc-500 dark:text-zinc-400" : "text-navy dark:text-white"
                    }`}
                  >
                    {n.title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">{timeAgo(n.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
