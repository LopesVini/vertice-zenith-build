// Configuração do Web Push (Fase 4 das notificações).
//
// A chave PÚBLICA VAPID pode viver no navegador — ela é pública por design
// (segue a mesma lógica da chave anon do Supabase em src/lib/supabase.ts).
// A chave PRIVADA correspondente NUNCA vem para cá: ela fica como secret da
// Edge Function send-web-push.
//
// Gere o par de chaves uma única vez com:
//     npx web-push generate-vapid-keys
// Cole a "Public Key" abaixo e guarde a "Private Key" para a Edge Function.
export const VAPID_PUBLIC_KEY = "BJfaBWZ97WfOu-MOZXjf6wlGhJptymaOGbR6KsgdcNU2jRGQbztqhCNVtj_8p58OjeL65zGkEvZX-BLcRx0qUGo"; // <-- cole aqui a Public Key gerada

/** true quando o navegador tem tudo que o Web Push precisa. */
export const PUSH_SUPPORTED =
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

/** Converte a chave VAPID (base64url) para o formato que o PushManager exige. */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}
