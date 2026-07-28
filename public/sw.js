// Service Worker do Vebram — responsável pelas notificações Web Push.
// Fica ativo em segundo plano mesmo com o site fechado (Android/desktop;
// no iPhone exige o app "Adicionar à Tela de Início"). Só trata push e
// clique — não faz cache de PWA.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_e) {
    data = { title: "Vebram", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Vebram";
  const options = {
    body: data.body || "",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: data.tag || undefined,
    data: { link: data.link || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((wins) => {
        // Se já houver uma aba aberta, foca nela e navega para o destino.
        for (const w of wins) {
          if ("focus" in w) {
            if ("navigate" in w) w.navigate(link).catch(() => {});
            return w.focus();
          }
        }
        // Senão, abre uma nova aba no destino.
        if (self.clients.openWindow) return self.clients.openWindow(link);
      })
  );
});
