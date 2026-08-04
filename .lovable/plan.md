# Preparar ConectaMente para o link público da Vercel

## Objetivo
Garantir que o app funcione 100% no deploy da Vercel, especialmente o chat com streaming, sem quebras de rota ou erro de variável de ambiente.

## Passos

1. **Criar `vercel.json`**
   - Adicionar rewrites para que o TanStack Start sirva a SPA corretamente em rotas aninhadas (ex.: `/chat`, `/mapa`).
   - Configurar headers para permitir streaming da resposta `/api/chat`.

2. **Verificar variável de ambiente `GROQ_API_KEY` na Vercel**
   - A rota `src/routes/api/chat.ts` lê `process.env["GROQ_API_KEY"]`.
   - Sem essa chave, o chat retorna erro 500 no deploy.
   - Instruir onde adicionar: Vercel Dashboard → Project → Settings → Environment Variables.

3. **Ajustar o handler de chat para streaming confiável na Vercel**
   - Confirmar que `result.toUIMessageStreamResponse()` está retornando headers corretos (`Content-Type: text/plain; charset=utf-8` e streaming).
   - Se necessário, garantir que a resposta não seja bufferizada pelo Nitro/Vercel.

4. **Rodar build local para validar**
   - Executar `bun run build` e corrigir qualquer erro de tipo ou rota antes do deploy.

5. **Testar o deploy publicado**
   - Abrir o link da Vercel.
   - Testar o chat: enviar uma mensagem e confirmar que a resposta aparece em streaming.
   - Testar navegação entre as abas: Dashboard, Chat, Reflexões, Mapa e Player.

## Resultado esperado
App acessível pelo link público da Vercel, com chat respondendo em tempo real e todas as rotas funcionando após refresh.
