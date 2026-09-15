# Área de dados e estatísticas reais no painel

Hoje o painel já mostra gráficos, mas quase nada aparece porque só três lugares do app registram cliques (os atalhos e cards da tela Início, o envio de mensagem no chat e o play de uma música). O restante do app não registra nada.

Já existem no banco: 22 visitas de página, 7 usos do chat e 3 cliques — dados reais, porém pouco representativos.

## O que será feito

### 1. Registrar tudo o que a pessoa faz

Passar a registrar cliques nas telas que hoje ficam de fora:

- Recursos: cada card/atalho aberto.
- Apoio: cada botão (mapa, contatos de emergência, links externos).
- Mapa de Apoio: filtros usados, local aberto, botão "Google Maps", ligar para o telefone.
- Reflexões: abas "Força" e "Paz", entrada na Pausa.
- Pausa: iniciar, pausar e concluir o cronômetro de 3 minutos.
- Perfil: botões da tela.
- Menu inferior: qual item foi tocado.
- Player: também registrar a troca de categoria (Natureza, Foco, Sono, Meditações).
- Chat: além de mensagem enviada, registrar conversa iniciada.

### 2. Nova seção "Dados e estatísticas" no painel

Abaixo dos gráficos atuais, uma área com números reais:

- Ranking completo de páginas, com número de visitas e percentual do total.
- Ranking completo de cliques (botão/card, quantas vezes, percentual).
- Uso do chat: conversas iniciadas e mensagens enviadas.
- Músicas: quantas vezes cada uma foi tocada e a categoria mais ouvida.
- Horários de maior uso (por hora do dia).
- Lista dos últimos 50 eventos: o que foi feito, onde e quando.
- Botão para baixar todos os dados do período em planilha (CSV).

Tudo continua anônimo (só tipo do evento, nome e data/hora) e só visível depois da senha.

## Detalhes técnicos

- `src/lib/track.ts`: manter a API atual e adicionar chamadas `rastrear("clique", ...)` nas rotas `recursos`, `apoio`, `mapa`, `reflexoes`, `pausa`, `perfil`, no `bottom-nav` e nas abas do `player`; `chat` ganha evento "Conversa iniciada".
- `src/lib/admin.functions.ts`: `obterMetricas` passa a devolver também `porHora`, `totais` com percentuais, `ultimos` (50 eventos recentes com tipo/nome/created_at) e contagem separada de chat (conversa vs mensagem). Nova server fn `exportarEventos` (protegida por `exigirAdmin`) devolvendo as linhas do período para download em CSV gerado no cliente.
- `src/routes/admin.tsx`: nova seção com tabelas de ranking, gráfico de barras por hora, tabela de eventos recentes e botão de exportação.
- Sem mudança de esquema no banco; as colunas atuais de `analytics_events` bastam.
