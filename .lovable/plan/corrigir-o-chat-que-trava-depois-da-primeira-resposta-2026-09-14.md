# Corrigir o chat que trava depois da primeira resposta

## O que está acontecendo

Reproduzi o erro chamando o chat direto. A primeira mensagem funciona normalmente. A partir da segunda, a resposta falha com:

```text
'messages.2' : for 'role:assistant' the following must be satisfied
[('messages.2' : property 'reasoning_content' is unsupported)]
```

Causa: o modelo atual devolve, junto com a resposta, um trecho de "raciocínio". Esse trecho fica guardado na conversa e é reenviado à Groq na mensagem seguinte — e a Groq recusa receber raciocínio de volta. Resultado: a tela fica em "Pensando..." e a conversa trava a partir da segunda mensagem.

Nos registros do app é exatamente o que se vê: a primeira resposta chega, a segunda falha com erro de streaming.

## Correção

1. **`src/routes/api/chat.ts`** — antes de enviar a conversa para a Groq, remover das mensagens anteriores os trechos de raciocínio (e marcadores de etapa), mantendo apenas os textos de usuário e assistente. É uma limpeza simples do histórico, sem mudar o modelo, o prompt da Conversa Amiga nem o streaming.

2. **Não exibir o raciocínio na conversa** — o histórico do chat passa a guardar só o texto final da resposta, que é o que o usuário vê. Isso também deixa a resposta mais rápida e evita que o problema volte.

3. **Mensagem de erro** — manter o texto claro de falha já existente, para diagnóstico futuro.

## Verificação

- Chamar o chat com um histórico de várias mensagens e confirmar que a resposta vem em texto real, sem erro.
- Abrir `/chat` no preview e trocar 3 mensagens seguidas, confirmando que todas são respondidas.
- Rodar o build.

## Depois

Nada muda na Vercel: mesma chave, mesmo modelo. Basta refazer o deploy com o código corrigido.
