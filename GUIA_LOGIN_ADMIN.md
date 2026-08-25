# Login do painel administrativo

## Correção aplicada

O aviso `Password field is not contained in a form` foi corrigido em `admin.html` e `admin-ministerio.html`: os campos agora estão dentro de um formulário semântico e o botão de login usa `type="submit"`.

O login Google também recebeu duas melhorias. Se o navegador bloquear o popup, o painel tenta o fluxo por redirecionamento. Se o Firebase devolver `auth/unauthorized-domain`, o painel informa que o domínio precisa ser autorizado no Firebase Authentication.

## Autorizar o domínio personalizado

O domínio usado pelo painel é `addiamantina.com`. No [Firebase Console do projeto ad-diamantina](https://console.firebase.google.com/project/ad-diamantina/overview):

1. Abra **Build → Authentication**.
2. Acesse a aba **Settings**.
3. Localize **Authorized domains**.
4. Clique em **Add domain**.
5. Digite somente `addiamantina.com`, sem `https://`, sem barras e sem `/admin.html`.
6. Salve a alteração.

Se o site também for acessado por `www.addiamantina.com`, adicione esse domínio separadamente. O domínio `addiamantina.com` é o que aparece no erro apresentado e é o mínimo necessário para o endereço atual.

Em **Authentication → Sign-in method**, confirme também que o provedor **Google** está habilitado.

## Teste após a autorização

Abra [`https://addiamantina.com/admin.html`](https://addiamantina.com/admin.html) e faça uma recarga forçada com `Ctrl + Shift + R`. No macOS, use `Cmd + Shift + R`. Se ainda aparecer a versão antiga por alguns minutos, teste a URL com cache-busting:

[`https://addiamantina.com/admin.html?rev=c1cec64`](https://addiamantina.com/admin.html?rev=c1cec64)

O login por e-mail e senha continua funcionando normalmente. Para o login Google, clique em **Entrar com Google**, escolha a conta `hewertonluann@gmail.com` e conclua a autorização. Contas adicionais somente entrarão se estiverem autorizadas no Firestore e com o e-mail verificado.

## Interpretação das mensagens

| Mensagem | Significado | Ação |
|---|---|---|
| `Password field is not contained in a form` | Aviso antigo de estrutura HTML | Corrigido no commit `c1cec64`; recarregue a página |
| `auth/unauthorized-domain` | O domínio da página não está na lista OAuth do Firebase | Adicione `addiamantina.com` em Authorized domains |
| Popup bloqueado | O navegador impediu a janela auxiliar | O painel tenta automaticamente o login por redirecionamento |
| E-mail ou senha incorretos | Falha nas credenciais do provedor e-mail/senha | Confira a conta e a senha no Firebase Authentication |
