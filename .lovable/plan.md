# Corrigir o chat em produção (Vercel + Groq)

## O que está acontecendo

A tela do chat usa o `useChat` do AI SDK, que espera uma resposta em **streaming no formato do AI SDK** (UI message stream). O backend em `src/routes/api/chat.ts` responde com um JSON simples (`{ text, message, response, ... }`). Como o formato não bate, o SDK nunca recebe a mensagem do assistente e a tela fica travada em "Pensando...", mesmo com o Groq retornando 200 OK.

Ou seja: não é problema do Vercel nem da chave do Groq — é incompatibilidade de formato entre backend e frontend.

## Solução

Manter o Groq como provedor e reescrever a rota `/api/chat` usando o AI SDK, que já está instalado no projeto (`ai` + `@ai-sdk/openai-compatible`). Assim a resposta sai em streaming e o texto aparece sendo digitado em tempo real.

### Backend — `src/routes/api/chat.ts`
- Criar o provedor Groq com `createOpenAICompatible` (`baseURL: https://api.groq.com/openai/v1`, header `Authorization: Bearer <GROQ_API_KEY>`), lendo `process.env.GROQ_API_KEY` **dentro** do handler.
- Manter o mesmo `SYSTEM_PROMPT` (Conversa Amiga) e o modelo `llama-3.3-70b-versatile`.
- Converter as mensagens recebidas com `convertToModelMessages` e chamar `streamText`.
- Retornar `result.toUIMessageStreamResponse()`.
- Erros (chave ausente, 429, 402, falha do Groq) retornam status e mensagem claros, que o `onError` do chat já transforma em toast.

### Frontend — `src/routes/chat.tsx`
Nenhuma mudança necessária: `useChat` + `DefaultChatTransport({ api: "/api/chat" })` já é o consumidor correto do formato de streaming.

## Verificação
- Rodar o build para garantir que a rota compila.
- Testar o chat no preview enviando uma mensagem e confirmando que a resposta aparece em streaming.
- Confirmar que a variável `GROQ_API_KEY` está configurada no projeto da Vercel (Settings > Environment Variables) e refazer o deploy.
