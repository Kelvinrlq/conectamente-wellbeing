# Disponibilizar os dados do painel na Vercel

## Diagnóstico confirmado

- A imagem mostra que o login e a sessão já funcionam na Vercel; o bloqueio atual acontece somente ao carregar estatísticas e playlists.
- O painel consulta o banco com uma credencial privada disponível no ambiente do Lovable, mas ausente na publicação externa da Vercel.
- As estatísticas existem e estão sendo registradas: no ambiente do Lovable, a consulta atual retornou visitas, cliques e conversas reais.
- Essa credencial privada não pode ser copiada ou exposta. O acesso será feito por uma ponte segura entre a Vercel e o backend do ConectaMente.

## Alterações

1. **Criar uma entrada segura para o painel externo**
   - Adicionar uma rota exclusiva para estatísticas, exportação e gestão de playlists.
   - Validar cada solicitação da Vercel no servidor antes de acessar os dados.
   - Assinar as solicitações com a senha administrativa já configurada nos dois ambientes, sem enviar ou registrar a senha em texto aberto.
   - Rejeitar assinaturas vencidas ou inválidas para evitar reutilização indevida.

2. **Usar o backend do ConectaMente quando o painel estiver na Vercel**
   - Manter o acesso direto atual no ambiente do Lovable.
   - Quando as credenciais do banco não existirem na Vercel, encaminhar automaticamente as operações autorizadas para o backend seguro do projeto.
   - Cobrir todas as funções existentes: métricas de 7/30/90 dias, últimas ações, download da planilha, listagem, inclusão e remoção de músicas.

3. **Corrigir o estado da interface**
   - Remover o aviso de “dados indisponíveis” quando a ponte segura estiver acessível.
   - Exibir as estatísticas e playlists normalmente após o login.
   - Em uma falha real de conexão, manter o painel aberto e mostrar uma mensagem clara com opção de tentar novamente.

4. **Validar antes da publicação**
   - Confirmar que uma solicitação sem autorização não consegue ler nem alterar dados.
   - Testar login, carregamento das estatísticas, troca de período, download da planilha e inclusão/remoção de playlist.
   - Confirmar que o painel continua funcionando no Lovable e que a aplicação compila sem erros.

## Publicação

Depois da correção, será necessário fazer um novo Redeploy na Vercel. Não será preciso cadastrar credenciais privadas do banco na Vercel; `ADMIN_PASSWORD` e `SESSION_SECRET`, que você já configurou, continuarão sendo as únicas chaves do painel nesse ambiente.
