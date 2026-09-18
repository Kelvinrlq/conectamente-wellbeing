# Corrigir o acesso ao painel administrador na Vercel

## Diagnóstico confirmado

- O endereço público `/admin` abre normalmente e a função de verificação do servidor responde com sucesso; não é uma falha da página ou da rota.
- No código atual, o login mostra “Senha incorreta” tanto quando a senha digitada não confere quanto quando `ADMIN_PASSWORD` não está disponível na publicação.
- A publicação externa não recebe automaticamente os segredos guardados no Lovable. Além de `ADMIN_PASSWORD`, o painel precisa de `SESSION_SECRET` para manter o acesso após o login e das credenciais do banco para carregar estatísticas e playlists.

## Implementação

1. **Tornar o erro do login preciso e seguro**
   - Fazer o servidor diferenciar “configuração ausente na publicação” de “senha incorreta”, sem revelar qualquer segredo.
   - Tratar falhas no formulário para impedir tela branca e mostrar uma orientação clara.

2. **Reforçar a sessão do painel**
   - Validar `SESSION_SECRET` antes de criar ou consultar a sessão.
   - Manter o cookie seguro e compatível com acesso direto no domínio público da Vercel.
   - Se a sessão não puder ser criada, retornar à tela de senha com mensagem específica.

3. **Validar as dependências do painel**
   - Antes de liberar o painel, confirmar no servidor que as configurações necessárias para estatísticas e playlists estão disponíveis.
   - Mostrar “publicação incompleta” em vez de aceitar o login e falhar ao carregar os dados.

4. **Configurar e republicar na Vercel**
   - Confirmar `ADMIN_PASSWORD` no ambiente **Production**, exatamente com o mesmo valor usado no Lovable, sem aspas ou espaços extras.
   - Adicionar uma `SESSION_SECRET` forte e exclusiva no ambiente **Production**.
   - Garantir que as configurações de conexão do banco usadas pelo painel estejam presentes no ambiente **Production**.
   - Fazer um novo deploy depois das alterações; variáveis adicionadas após o último deploy não entram na versão já publicada.

5. **Teste final no link público**
   - Entrar com a senha correta, atualizar a página e confirmar que a sessão continua ativa.
   - Conferir carregamento das estatísticas, download da planilha e inclusão/remoção de playlist.
   - Testar senha errada e configuração ausente para confirmar mensagens corretas e ausência de tela branca.

## Limite externo

Posso corrigir e validar o comportamento do aplicativo. As variáveis da conta Vercel precisam ser cadastradas no painel da própria Vercel; seus valores não serão colocados no código nem exibidos.
