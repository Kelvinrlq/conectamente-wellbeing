import { createFileRoute } from "@tanstack/react-router";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      OPTIONS: async () => {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      },

      POST: async ({ request }: { request: Request }) => {
        try {
          const apiKey = process.env["GROQ_API_KEY"];

          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "Chave GROQ_API_KEY não configurada." }),
              { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
            );
          }

          const body = (await request.json()) as { messages?: UIMessage[] };
          const messages = body.messages;

          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Mensagens inválidas" }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS },
            });
          }

          const groq = createOpenAICompatible({
            name: "groq",
            baseURL: "https://api.groq.com/openai/v1",
            headers: { Authorization: `Bearer ${apiKey}` },
          });

          const result = streamText({
            model: groq("openai/gpt-oss-120b"),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
            temperature: 0.7,
            providerOptions: {
              groq: { reasoning_effort: "low" },
            },
          });

          const response = result.toUIMessageStreamResponse({
            originalMessages: messages,
            onError: (error) => {
              console.error("groq stream error", error);
              const msg = error instanceof Error ? error.message : String(error);
              return `Não consegui responder agora (Groq): ${msg}`;
            },
          });
          const headers = new Headers(response.headers);
          Object.entries(CORS_HEADERS).forEach(([key, value]) => headers.set(key, value));

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Erro interno no servidor";
          console.error("chat route error", e);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          });
        }
      },
    },
  },
});
