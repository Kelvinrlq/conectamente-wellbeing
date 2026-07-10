Ajustar o player de bem-estar:

1. **src/data/conteudo.ts** — Substituir o `videoId` da categoria `foco` por um vídeo de lofi/foco padrão do YouTube que não seja transmissão ao vivo, evitando a mensagem "A gravação dessa transmissão ao vivo não está disponível". Atualizar também o `nome` e a `descricao` para refletir o novo vídeo escolhido.

2. **src/routes/player.tsx** — Remover o parágrafo inferior que diz "Para trocar, copie o ID depois de v=...", deixando a interface mais limpa.

Escopo: apenas player de bem-estar. Outras rotas, chat, mapa e reflexões não serão alterados.