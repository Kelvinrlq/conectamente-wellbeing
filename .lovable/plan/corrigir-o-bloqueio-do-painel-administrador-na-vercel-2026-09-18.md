# Corrigir o bloqueio do painel administrador na Vercel

## Diagnóstico confirmado

- A imagem mostra “publicação incompleta” e o botão de entrada bloqueado.
- O código considera a publicação completa somente quando encontra quatro variáveis: `ADMIN_PASSWORD`, `SESSION_SECRET` e duas credenciais privadas do banco.
- Você já configurou corretamente as duas variáveis necessárias para autenticar e manter a sessão. O bloqueio continua porque a verificação mistura o login com a conexão das estatísticas e playlists.

## Alterações

1. **Liberar o login com a configuração correta**
   - Validar o acesso usando somente `ADMIN_PASSWORD` e `SESSION_SECRET`.
   - Manter a comparação segura da senha e a sessão criptografada.
   - Não desabilitar o botão por causa de uma dependência de dados ausente.

2. **Separar acesso e carregamento dos dados**
   - Depois do login, verificar separadamente se estatísticas e playlists estão disponíveis.
   - Se a Vercel não conseguir acessar esses dados, manter o painel aberto e mostrar um aviso específico, sem tela branca e sem chamar a senha de incorreta.
   - Preservar todas as funções existentes quando a conexão estiver disponível.

3. **Melhorar as mensagens**
   - Distinguir claramente: senha incorreta, sessão não configurada e dados indisponíveis.
   - Não mostrar nomes ou valores secretos na tela.

4. **Validar**
   - Testar senha correta, senha errada, atualização da página e saída do painel.
   - Testar também o comportamento quando os dados não estiverem disponíveis.
   - Confirmar que a aplicação continua compilando sem erros.

## Limite da publicação externa

A correção permitirá entrar no painel com as duas variáveis já configuradas. Estatísticas privadas e alterações de playlists ainda dependem de uma conexão segura com o banco; se essa conexão não estiver disponível na Vercel, o painel informará isso sem bloquear o login. Essas credenciais privadas não serão colocadas no código nem expostas ao navegador.
