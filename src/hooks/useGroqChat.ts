import { useState } from "react";

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export function useGroqChat(systemPrompt: string, initialMessage?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessage
      ? [{ id: 0, role: "assistant", content: initialMessage }]
      : []
  );
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now(), role: "user", content: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setIsLoading(true);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.4,
          max_tokens: 512,
          messages: [
            { role: "system", content: systemPrompt },
            // Envia apenas o conteúdo (sem id) para a API
            ...nextHistory.map(({ role, content }) => ({ role, content })),
          ],
        }),
      });

      if (!res.ok) throw new Error(`Groq ${res.status}`);

      const data = await res.json();
      const reply: string =
        data.choices?.[0]?.message?.content?.trim() ??
        "Desculpe, não consegui processar sua pergunta no momento.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Ops, tive um problema de conexão. Tente novamente em instantes.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, isLoading, sendMessage };
}
