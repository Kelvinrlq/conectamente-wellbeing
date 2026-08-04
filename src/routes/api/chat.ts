import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenAI } from "@google/genai";

// Inicialização oficial do SDK do Google Generative AI
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

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
          const body = await request.json();
          const messages = body.messages || [];

          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response("Mensagens inválidas", { status: 400 });
          }

          // Pega a última mensagem enviada pelo usuário
          const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user");
          const promptText = lastUserMessage
            ? typeof lastUserMessage.content === "string"
              ? lastUserMessage.content
              : lastUserMessage.parts?.[0]?.text || ""
            : "";

          // Modelo atualizado para o identificador ativo no @google/genai
          const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: promptText,
            config: {
              systemInstruction: SYSTEM_PROMPT,
            },
          });

          const text = response.text || "Desculpe, não consegui processar sua resposta no momento.";

          return new Response(JSON.stringify({ text }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e: any) {
          console.error("chat route error", e);
          return new Response(JSON.stringify({ error: e.message || "Erro interno" }), { status: 500 });
        }
      },
    },
  },
});