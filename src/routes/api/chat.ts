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
          const apiKey = process.env.GROQ_API_KEY;

          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "Chave GROQ_API_KEY não configurada na Vercel." }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          const body = await request.json();
          const messages = body.messages || [];

          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Mensagens inválidas" }), { status: 400 });
          }

          // Formata as mensagens para a API Groq/OpenAI
          const formattedMessages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m: any) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: typeof m.content === "string" ? m.content : m.parts?.[0]?.text || "",
            })),
          ];

          const apiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: formattedMessages,
              temperature: 0.7,
              max_tokens: 500,
            }),
          });

          const data = await apiResponse.json();

          if (!apiResponse.ok) {
            console.error("Groq API error:", data);
            return new Response(
              JSON.stringify({ error: data.error?.message || "Erro na API Groq" }),
              { status: apiResponse.status, headers: { "Content-Type": "application/json" } }
            );
          }

          const text = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua resposta no momento.";

          // Enviamos um "Curinga" com todas as variações para o frontend encontrar!
          return new Response(JSON.stringify({ 
            text: text,
            message: text,
            response: text,
            resposta: text,
            content: text,
            choices: data.choices // Caso o frontend espere o padrão OpenAI original
          }), {
            headers: { "Content-Type": "application/json" },
          });
          
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