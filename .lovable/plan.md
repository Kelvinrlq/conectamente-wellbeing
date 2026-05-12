
# ConectaMente — Plano de Implementação

App mobile-first de apoio à saúde mental para estudantes, com 4 áreas principais e navegação inferior fixa. Visual moderno, acolhedor e profissional.

## Design System

Paleta (definida em `src/styles.css` em oklch):
- Azul primário (confiança) — fundo de hero e botões principais
- Verde-água (calma) — superfícies acolhedoras, cards de reflexão
- Laranja (energia/acolhimento) — CTAs de destaque, badges
- Neutros suaves para textos e fundos

Tipografia limpa (Inter), cards arredondados (radius 1rem), sombras suaves, ícones Lucide. Layout mobile-first com largura máxima ~480px centralizada em telas maiores.

## Estrutura de Rotas (TanStack Start)

```
src/routes/
  __root.tsx              shell + bottom nav fixo
  index.tsx               Dashboard (Início)
  recursos.tsx            Reflexões + Player de áudio
  apoio.tsx               Chat anônimo + Mapa de apoio profissional
  perfil.tsx              Perfil/preferências
  chat.tsx                Tela cheia do Chat de Apoio (IA)
  reflexoes.tsx           Central de Reflexões completa
  pausa.tsx               Cronômetro 3 min "Pausa e Reflexão"
  mapa.tsx                Localizador profissional (mapa)
  player.tsx              Player de áudio dedicado
  api/chat.ts             Server route com streamText (Lovable AI Gateway)
```

## Telas

**1. Dashboard (`/`)**
- Header com logo "ConectaMente" + ícone cérebro/coração
- 4 cards grandes em grid 2×2: Conversa Amiga, Conselho do Dia, Músicas Calmas, Reflexões
- Seção "Conteúdo em Destaque" com carrossel horizontal de meditações guiadas
- Frase motivacional do dia

**2. Chat de Apoio Anônimo (`/chat`)**
- Mensagens automáticas de boas-vindas reforçando anonimato e segurança
- Banner discreto: "Anônimo • Não salvamos suas mensagens"
- AI Elements (Conversation, Message, MessageResponse, PromptInput, Shimmer)
- Streaming via `/api/chat` com Lovable AI Gateway (Gemini 3 Flash)
- System prompt: companheiro empático, não-diagnóstico, redireciona para emergência (188/CVV) em caso de risco
- Disclaimer de emergência fixo no topo
- Sem persistência (uma conversa por sessão, conforme escolha do usuário)

**3. Central de Reflexões (`/reflexoes`)**
- Card "Reflexão do Dia" com frase inspiradora rotativa
- Botão grande "Pausa e Reflexão" → `/pausa` (cronômetro 3min com animação respiração e som ambiente opcional)
- Dois botões: "Mensagens de Força" e "Mensagens de Paz" (listas curadas, mock inicial)

**4. Localizador de Apoio (`/mapa`)**
- Mapa interativo com **Leaflet + react-leaflet + OpenStreetMap tiles** (sem API key, leve, funciona em Worker SSR como client-only component)
- Centrado em Corumbá-MS (-19.0078, -57.6531)
- Filtros (chips): Psicólogos Online, Rede Pública (CAPS/UBS), Contatos de Emergência
- Marcadores coloridos por categoria + popup com nome, endereço, telefone, botão "Ligar" e "Ver no Google Maps"
- Lista abaixo do mapa para acessibilidade
- Dados em `src/data/locais.ts` (estrutura pronta, placeholders — usuário fornecerá)
- Card destacado de Emergência: CVV 188, SAMU 192, Polícia 190

**5. Player de Bem-estar (`/player`)**
- Tabs: Sons da Natureza, Foco Profundo, Sono, Meditações Guiadas
- Player principal: **iframe embed do Spotify** (`https://open.spotify.com/embed/playlist/{id}`) — placeholder até o usuário fornecer
- Lista de playlists/categorias clicáveis que trocam o embed

**6. Perfil (`/perfil`)**
- Preferências (tema, lembretes de pausa)
- Informações sobre privacidade e anonimato
- Links úteis e créditos
- Sem login (escolha do usuário: "só chat com IA real")

## Navegação

Bottom nav fixo em `__root.tsx` com 4 itens (Lucide icons): Home, BookOpen (Recursos), HeartHandshake (Apoio), User (Perfil). Estado ativo destacado em azul primário.

## Backend / IA

- Lovable AI Gateway via Vercel AI SDK
- Server route `src/routes/api/chat.ts` com `streamText`, modelo `google/gemini-3-flash-preview`
- Sem banco de dados, sem auth (escolha do usuário)
- Tratamento explícito de 429/402 com toast amigável

## Detalhes Técnicos

- Pacotes a instalar: `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`, `zod`, AI Elements (`conversation message prompt-input shimmer`), `leaflet`, `react-leaflet`, `@types/leaflet`
- Helper `src/lib/ai-gateway.ts` com `createLovableAiGatewayProvider`
- Mapa carregado como componente client-only (dynamic) para evitar SSR do Leaflet
- Logo gerado (imagegen, premium, transparente) — cérebro estilizado com coração, paleta azul/verde-água/laranja
- Imagens decorativas para hero/cards geradas em src/assets
- SEO: `head()` com title/description únicos por rota

## Fora de escopo (conforme pedido)

- Sem gamificação, sem jogos
- Sem autenticação ou persistência nesta versão
- Conteúdos reais (playlist Spotify, locais Corumbá) ficam como placeholders editáveis
