# Painel administrador do ConectaMente

Área restrita, aberta com uma senha única, com gráficos de uso do app e gestão das playlists.

## Por que precisa de um "banco de dados"

Hoje as playlists ficam escritas dentro do próprio app (arquivo fixo) e nada é registrado sobre o uso. Para o admin adicionar/remover músicas e todo mundo ver na hora, e para guardar os acessos e cliques, o app passa a usar o Lovable Cloud (banco de dados integrado, sem conta externa).

## Entrada no painel

- Nova página `/admin` com um campo de senha.
- A senha fica guardada em segredo no servidor (nunca no código nem visível no navegador).
- Após acertar, o navegador guarda um acesso seguro por 7 dias; há botão "Sair".
- Sem senha, a página só mostra o formulário — nenhum dado do painel é carregado.

## Registro de uso

O app passa a registrar, de forma anônima (sem identificar a pessoa):

- Visitas a cada tela: Início, Recursos, Apoio, Perfil, Reflexões, Pausa, Mapa, Player, Chat.
- Cliques nos cards e botões principais do Início e Recursos.
- Conversas iniciadas no chat e mensagens enviadas.
- Qual playlist foi aberta/tocada.

Cada registro guarda apenas: tipo do evento, nome do item, data/hora.

## O que o painel mostra

- Cartões de resumo: visitas totais, cliques, conversas de chat, playlists tocadas (últimos 7/30 dias).
- Gráfico de barras: páginas mais visitadas.
- Gráfico de barras: botões/cards mais clicados.
- Gráfico de barras: playlists mais tocadas + total de conversas no chat.
- Gráfico de linha: evolução dos acessos por dia.
- Seletor de período: 7, 30 ou 90 dias.

## Gestão de playlists

- Lista das músicas atuais agrupadas por categoria (Natureza, Foco, Sono, Meditações).
- Adicionar: categoria, nome, link ou ID do vídeo do YouTube, descrição. O link é convertido para o ID automaticamente.
- Remover e reordenar itens.
- A tela do Player passa a ler essa lista do banco, então a mudança aparece para todos imediatamente; as músicas atuais entram como conteúdo inicial.

## Detalhes técnicos

- Ativar Lovable Cloud.
- Tabelas: `playlists` (categoria, nome, video_id, descrição, ordem, criado_em) e `analytics_events` (tipo, nome, metadata, criado_em).
  - `playlists`: SELECT público para `anon`/`authenticated`; escrita apenas via server function admin (service role) após validar a sessão.
  - `analytics_events`: sem leitura pública; inserção feita por server function pública com validação de entrada (tipo/nome restritos por lista); leitura agregada apenas na sessão admin.
  - GRANTs explícitos em ambas as tabelas.
- Segredos: `ADMIN_PASSWORD` (informada pelo usuário no formulário seguro) e `SESSION_SECRET` (gerada automaticamente).
- Sessão via `useSession` do TanStack Start (cookie httpOnly criptografado), comparação de senha com hash + `timingSafeEqual`.
- Server functions em `src/lib/admin.functions.ts` (login, logout, métricas agregadas, CRUD de playlists) e `src/lib/analytics.functions.ts` (registro de evento, público e sem retorno de dados).
- Registro de páginas por um hook no `__root.tsx` observando mudança de rota; cliques por chamadas pontuais nos componentes.
- Gráficos com `recharts`.
- `src/data/conteudo.ts` deixa de ser a fonte das playlists (vira apenas seed da migração); `src/routes/player.tsx` passa a carregar do banco.
- `/admin` não aparece no menu inferior e recebe `noindex`.
