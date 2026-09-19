# Corrigir o carregamento das estatísticas no painel da Vercel

## Diagnóstico confirmado

- O acesso ao painel e a sessão estão funcionando; a falha ocorre na consulta dos dados.
- Os registros mostram várias respostas **401 — não autorizado** ao buscar estatísticas e playlists pela publicação da Vercel.
- A validação atual mistura a senha administrativa com a chave da sessão. Como a chave da sessão da Vercel é diferente da usada ao preparar o acesso ao banco, a consulta é recusada.
- Os dados não foram perdidos: existem atualmente **196 registros reais** de páginas, cliques e chat, além de **5 playlists**.
- Os dados aparecem por um instante porque o botão “Tentar novamente” esconde o aviso antes da consulta terminar; quando a resposta 401 chega, a tela volta ao erro.

## Alterações

1. **Corrigir a autorização dos dados**
   - Usar a senha administrativa compartilhada para autorizar a consulta segura ao banco.
   - Manter `SESSION_SECRET` somente para proteger a sessão do painel, sem usá-la para validar estatísticas e playlists.
   - Atualizar a função protegida do banco e o código do painel para usarem a mesma validação.

2. **Estabilizar o carregamento da tela**
   - Criar um estado de carregamento real para a primeira consulta e para “Tentar novamente”.
   - Não esconder dados já carregados durante uma atualização.
   - Só mostrar a mensagem de falha quando a nova tentativa realmente terminar com erro, evitando o efeito de aparecer e sumir.

3. **Manter todos os recursos do painel**
   - Preservar períodos de 7, 30 e 90 dias, rankings, gráficos, horários, últimas ações e planilha.
   - Preservar listagem, inclusão e remoção de músicas.
   - Exibir todos os registros disponíveis dentro do período escolhido.

4. **Validar ponta a ponta**
   - Confirmar que pedidos sem a autorização correta continuam bloqueados.
   - Testar login, primeira carga, nova tentativa, troca de período, planilha e playlists.
   - Confirmar que os 196 registros existentes aparecem corretamente e que a aplicação continua sem erros.

## Publicação

Depois da correção, será necessário um novo **Redeploy** na Vercel para que o painel público use a autorização atualizada. Não será preciso adicionar novas variáveis: `ADMIN_PASSWORD` e `SESSION_SECRET` continuam sendo suficientes.
