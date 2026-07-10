## Substituir Spotify por playlists do YouTube

Trocar o embed do Spotify no `/player` por embeds do YouTube (playlists). O YouTube toca as faixas inteiras sem login e o próprio player mostra a duração real de cada música.

### Mudanças

**1. `src/data/conteudo.ts`**
- Renomear `playlistsSpotify` → `playlistsYoutube`.
- Cada categoria (`natureza`, `foco`, `sono`, `meditacao`) passa a ter `{ nome, playlistId, descricao }` com IDs de playlists públicas do YouTube (placeholders coerentes por categoria — ex.: sons de chuva/natureza, lofi focus, sleep music, meditações guiadas em português).
- Comentário no topo explicando como trocar o `playlistId` (parte depois de `list=` na URL do YouTube).

**2. `src/routes/player.tsx`**
- Substituir o `<iframe>` do Spotify por um `<iframe>` do YouTube:
  - `src`: `https://www.youtube.com/embed/videoseries?list={playlistId}&rel=0&modestbranding=1`
  - `allow`: `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen`
  - Aspect ratio 16:9 (`aspect-video`) em vez de altura fixa de 352px, para o player de vídeo do YouTube.
- Atualizar a legenda inferior para instruir a edição em `src/data/conteudo.ts` com o `playlistId` do YouTube.
- Manter tabs, header e restante do layout intactos.

### Fora de escopo

- Não mexer em outras rotas, chat, mapa, reflexões, dashboard ou design system.
- Sem player customizado nem download de áudios — apenas embed do YouTube.
