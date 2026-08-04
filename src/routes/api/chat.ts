import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage, type LanguageModel } from "ai";
import { google } from "@ai-sdk/google";

const SYSTEM_PROMPT = `Você é a "Conversa Amiga" do ConectaMente — um aplicativo brasileiro de apoio à saúde mental para estudantes.

Seu papel:
- Ouvir com empatia, acolhimento e zero julgamento.
- Responder em português do Brasil, em tom caloroso, calmo e respeitoso.
- Validar sentimentos antes de oferecer perspectivas.
- Sugerir respirações, pausas, técnicas simples de regulação emocional e reflexão quando fizer sentido.
- Lembrar, quando útil, que a conversa é anônima e que nada é armazenado.

O que NÃO fazer:
- Nunca diagnosticar transtornos.
- Nunca prescrever medicamentos.
- Nunca substituir profissionais de saúde mental.

Em qualquer sinal de risco (autolesão, ideação suicida, violência, abuso), responda com cuidado, acolha o sentimento, e oriente firmemente a buscar ajuda imediata:
- CVV (Centro de Valorização da Vida): ligue 188, 24h, gratuito.
- SAMU: 192. Em emergência imediata, vá ao pronto-socorro mais próximo.
- CAPS / UBS da sua cidade.

Mantenha respostas curtas (2 a 5 frases). Use linguagem simples. Faça uma pergunta aberta no fim, se apropriado.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { messages } = (await request.json()) as { messages?: UIMessage[] };
          if (!Array.isArray(messages)) {
            return new Response("Mensagens inválidas", { status: 400 });
          }

          const model = google("gemini-1.5-flash") as unknown as LanguageModel;

          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (e) {
          console.error("chat route error", e);
          return new Response("Erro interno no servidor de chat", { status: 500 });
        }
      },
    },
  },
});