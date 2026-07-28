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
        className="relative flex h-10 w-10 items-center justify-center rounded-sys border border-sys-rule-strong text-sys-ink-2 transition-colors duration-150 hover:bg-sys-ink/[0.05] hover:text-sys-ink"
        aria-label={
          unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : "Notificações"
        }
      >
        <Bell size={17} />
        {/* Sinal de pendência em ocre — o mesmo tom que marca "há algo a fazer"
            em todo o sistema. A contagem no aria-label evita depender só da cor. */}
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 bg-sys-ochre" />
        )}
      </button>

      {open && (
        <div
          className={`fixed inset-x-3 top-16 z-50 w-auto overflow-hidden rounded-sys border border-sys-rule-strong bg-sys-raised shadow-sys lg:absolute lg:inset-x-auto ${desktopAnchor} lg:top-12 lg:w-80`}
        >
          <div className="flex items-center justify-between border-b border-sys-rule px-4 py-3">
            <span className="font-sans text-[13px] font-extrabold uppercase tracking-tight text-sys-ink">
              Notificações
            </span>
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
                  className="sys-rotulo flex items-center gap-1.5 text-sys-ink-3 transition-colors hover:text-sys-ink disabled:opacity-45"
                >
                  {push.subscribed ? <BellOff size={13} /> : <BellRing size={13} />}
                  <span className="hidden sm:inline">{push.subscribed ? "Desativar" : "Ativar"}</span>
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="sys-rotulo flex items-center gap-1.5 text-sys-accent transition-colors hover:text-sys-ink"
                >
                  <CheckCheck size={13} /> Ler todas
                </button>
              )}
            </div>
          </div>
          <div className="max-h-80 divide-y divide-sys-rule overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-[13px] text-sys-ink-3">
                Nenhuma notificação por aqui ainda.
              </p>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleOpen(n)}
                className={`relative flex gap-3 px-4 py-3 transition-colors duration-150 hover:bg-sys-ink/[0.04] ${
                  n.link ? "cursor-pointer" : "cursor-default"
                }`}
              >
                {/* Não lida = régua ocre na margem + tinta cheia. */}
                {!n.read_at && <span className="absolute inset-y-0 left-0 w-[2px] bg-sys-ochre" />}
                <span
                  className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 ${
                    n.read_at ? "bg-sys-rule-strong" : "bg-sys-ochre"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-[13px] font-semibold ${
                      n.read_at ? "text-sys-ink-2" : "text-sys-ink"
                    }`}
                  >
                    {n.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[13px] text-sys-ink-3">{n.body}</p>
                  <p className="mt-1.5">
                    <span className="sys-rotulo text-sys-ink-3">{timeAgo(n.created_at)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
