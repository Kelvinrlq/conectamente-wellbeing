# Sincronizar Lovable → GitHub → Vercel (chat funcionando)

## O que está acontecendo

Você editou e corrigiu o chat aqui no Lovable (incluindo a troca do modelo da Groq descontinuado), mas o seu repositório local no VS Code não tem essas mudanças. O `git push origin main` foi rejeitado porque o GitHub também tem commits que o seu VS Code não tem (provavelmente o README criado na criação do repositório).

## Objetivo

Colocar a versão corrigida do Lovable no GitHub para que a Vercel faça o deploy automaticamente com o chat respondendo.

## Passos

### 1. Trazer o código atualizado do Lovable para o seu computador

Opção A — baixar o projeto do Lovable como ZIP e substituir a pasta local:
- No Lovable, exportar/baixar o projeto atual.
- Descompactar e substituir os arquivos na pasta `conectamente-wellbeing` do seu computador.
- Depois rodar os comandos git abaixo.

Opção B — se o Lovable já estiver conectado ao mesmo repositório GitHub:
- No VS Code, fazer `git pull origin main` para puxar as mudanças do Lovable.
- Se der conflito, resolver mantendo os arquivos corrigidos do Lovable.

### 2. Resolver o conflito do Git e fazer o push

No terminal do VS Code, dentro da pasta do projeto:

```bash
# Puxar o que existe no GitHub e mesclar com o seu local
git pull origin main --allow-unrelated-histories
```

Se aparecer algum conflito, o VS Code vai mostrar. Resolva mantendo sempre a versão que veio do Lovable (que já tem o chat corrigido).

Depois:

```bash
git add .
git commit -m "atualiza chat com modelo Groq funcional"
git push origin main
```

Se o GitHub tiver apenas um README inicial e você quiser sobrescrever tudo com o código do Lovable:

```bash
git push origin main --force
```

> Atenção: `--force` apaga o histórico remoto e coloca o seu local no lugar. Só use se o GitHub não tiver código importante.

### 3. Verificar o deploy na Vercel

- Assim que o push chegar no GitHub, a Vercel detecta e inicia um novo deploy sozinha.
- Acompanhar em: Vercel Dashboard → Projeto → Deployments.

### 4. Confirmar a variável de ambiente na Vercel

A rota `/api/chat` precisa da chave `GROQ_API_KEY`.

- Vercel Dashboard → Projeto → Settings → Environment Variables.
- Verificar se existe `GROQ_API_KEY` com a sua chave da Groq.
- Se não existir, adicionar e fazer um novo deploy (ou clicar em "Redeploy").

### 5. Testar o chat no link público

- Abrir o link da Vercel no celular/navegador.
- Enviar uma mensagem no chat e confirmar que a resposta aparece em streaming.

## Resultado esperado

O link público da Vercel vai servir a versão corrigida do ConectaMente com o chat respondendo normalmente.
