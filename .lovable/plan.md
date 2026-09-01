# Corrigir o chat (modelo da Groq foi descontinuado)

## O que está acontecendo

Testei o endpoint `/api/chat` direto e ele responde 200, mas o stream traz um erro. O log do servidor mostra a causa exata:

```text
The model `llama-3.3-70b-versatile` does not exist or you do not have access to it.
```

Consultei a lista de modelos da sua conta Groq com a sua chave: o `llama-3.3-70b-versatile` foi descontinuado e não está mais disponível. Os modelos de conversa ativos hoje na sua conta são, entre outros: `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b` e `groq/compound`.

Ou seja: não é a Vercel, não é a chave e não é o formato de streaming — é só o nome do modelo, que deixou de existir.

## Correção

1. **`src/routes/api/chat.ts`** — trocar o modelo `llama-3.3-70b-versatile` por `openai/gpt-oss-120b` (o mais capaz disponível na sua conta, com 131k de contexto e boa qualidade em português). Nada mais muda: mesmo `SYSTEM_PROMPT` da Conversa Amiga, mesmo streaming, mesmos headers de CORS.

2. **Mensagem de erro mais clara** — quando a Groq recusar o modelo ou a chave, retornar um texto explicando o motivo em vez de um "An error occurred." genérico, para facilitar o diagnóstico no futuro.

## Verificação

- Chamar `/api/chat` e confirmar que o stream traz texto real da IA, sem evento de erro.
- Abrir `/chat` no preview, enviar uma mensagem e ver a resposta sendo digitada.
- Rodar o build.

## Depois do deploy

Nenhuma mudança necessária na Vercel — a `GROQ_API_KEY` continua a mesma. Basta refazer o deploy com o código corrigido.
