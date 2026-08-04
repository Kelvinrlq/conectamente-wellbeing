import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

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
          const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "Chave de API (GEMINI_API_KEY) não configurada no servidor." }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          const body = await request.json();
          const messages = body.messages || [];

          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Mensagens inválidas" }), { status: 400 });
          }

          // Pega a última mensagem enviada pelo usuário
          const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user");
          const promptText = lastUserMessage
            ? typeof lastUserMessage.content === "string"
              ? lastUserMessage.content
              : lastUserMessage.parts?.[0]?.text || ""
            : "";

          if (!promptText) {
            return new Response(JSON.stringify({ error: "Texto da mensagem está vazio" }), { status: 400 });
          }

          // Modelos a serem testados em ordem de prioridade
          const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash"];
          let lastErrorMessage = "";

          for (const model of modelsToTry) {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const apiResponse = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: SYSTEM_PROMPT }],
                },
                contents: [
                  {
                    role: "user",
                    parts: [{ text: promptText }],
                  },
                ],
              }),
            });

            const data = await apiResponse.json();

            if (apiResponse.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
              const text = data.candidates[0].content.parts[0].text;
              return new Response(JSON.stringify({ text }), {
                headers: { "Content-Type": "application/json" },
              });
            }

            lastErrorMessage = data.error?.message || JSON.stringify(data);
            console.error(`Erro ao tentar modelo ${model}:`, lastErrorMessage);
          }

          return new Response(
            JSON.stringify({ error: `Falha na API Gemini: ${lastErrorMessage}` }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        } catch (e: any) {
          console.error("chat route error", e);
          return new Response(
            JSON.stringify({ error: e.message || "Erro interno no servidor" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});