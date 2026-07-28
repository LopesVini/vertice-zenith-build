import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/data/useAuth";
import { VAPID_PUBLIC_KEY, PUSH_SUPPORTED, urlBase64ToUint8Array } from "@/lib/push";

// Gerencia a inscrição Web Push DESTE aparelho para o usuário logado.
// - subscribe(): pede permissão, registra o Service Worker e salva a
//   inscrição no banco (a Edge Function send-web-push lê de lá).
// - unsubscribe(): desfaz a inscrição neste aparelho.
// Ele detecta se já existe inscrição ativa ao montar.
export function usePushNotifications() {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(
    PUSH_SUPPORTED ? Notification.permission : "denied"
  );

  // Detecta uma inscrição já existente neste navegador.
  useEffect(() => {
    if (!PUSH_SUPPORTED) return;
    navigator.serviceWorker
      .getRegistration()
      .then(async (reg) => {
        const sub = await reg?.pushManager.getSubscription();
        setSubscribed(!!sub);
      })
      .catch(() => {});
  }, []);

  const subscribe = useCallback(async () => {
    if (!PUSH_SUPPORTED || !user) return;
    if (!VAPID_PUBLIC_KEY) {
      console.warn("[push] VAPID_PUBLIC_KEY não configurada em src/lib/push.ts");
      return;
    }
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const json = sub.toJSON();
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          user_id: user.id,
          endpoint: sub.endpoint,
          p256dh: json.keys?.p256dh ?? "",
          auth: json.keys?.auth ?? "",
          user_agent: navigator.userAgent,
        },
        { onConflict: "endpoint" }
      );
      if (error) throw error;
      setSubscribed(true);
    } catch (err) {
      console.error("[push] falha ao ativar:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const unsubscribe = useCallback(async () => {
    if (!PUSH_SUPPORTED) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } catch (err) {
      console.error("[push] falha ao desativar:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { supported: PUSH_SUPPORTED, permission, subscribed, loading, subscribe, unsubscribe };
}
