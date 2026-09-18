# Liberar o acesso ao painel administrador

## Diagnóstico confirmado

- A tela pública marca a publicação como incompleta antes do envio.
- O botão **Entrar** está ligado a esse estado e fica desativado, embora o campo aceite a senha.
- Assim, a senha nunca chega a ser validada pelo servidor.

## Alterações

1. **Liberar o botão Entrar**
   - Desativá-lo somente enquanto uma tentativa de entrada estiver em andamento.
   - Permitir o envio da senha mesmo quando a verificação inicial de configuração falhar.

2. **Corrigir a verificação inicial**
   - Não transformar qualquer falha temporária ao consultar o estado do painel em “publicação incompleta”.
   - Manter a tela utilizável e informar que não foi possível confirmar a configuração, sem bloquear o acesso.

3. **Mostrar o erro correto após o envio**
   - Senha diferente: informar “Senha incorreta”.
   - `ADMIN_PASSWORD` ausente: informar que a senha do painel não está disponível na publicação.
   - `SESSION_SECRET` ausente ou curta: informar que a sessão do painel não está configurada.
   - Não revelar valores secretos.

4. **Preservar o acesso quando os dados estiverem indisponíveis**
   - Após uma autenticação válida, abrir o painel normalmente.
   - Se estatísticas ou playlists não puderem ser carregadas, mostrar o aviso já existente sem voltar à tela de senha.

5. **Validar**
   - Confirmar que o botão pode ser acionado após digitar a senha.
   - Testar senha correta, senha incorreta, falha da consulta inicial e atualização da página com sessão ativa.
   - Confirmar que a aplicação continua compilando sem erros.

## Publicação

A correção precisará de um novo Redeploy na Vercel para aparecer em `conectamente-crb.vercel.app/admin`.
