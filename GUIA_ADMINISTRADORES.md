# Gestão de administradores — AD Diamantina

## O que foi implementado

O painel administrativo agora possui uma área chamada **Administradores**, visível somente para `hewertonluann@gmail.com`. Ela permite autorizar contas adicionais informando apenas o e-mail, definir um nome de identificação, ativar ou desativar o acesso e remover a autorização.

A conta autorizada não recebe uma nova senha pelo painel. Ela precisa existir previamente em **Firebase Authentication** e ter o e-mail verificado. A autorização é feita no Firestore pelo documento `admins/{email}`; o e-mail normalizado em minúsculas é usado como identificador.

## Publicar as regras no Firebase Console

A publicação do código HTML já foi enviada para a branch `main` e o Render confirmou a presença da nova página. As regras de segurança precisam ser publicadas no Firebase Console porque a sessão local da CLI não está autenticada.

1. Acesse o [Firebase Console do projeto ad-diamantina](https://console.firebase.google.com/project/ad-diamantina/overview).
2. Abra **Build → Firestore Database → Rules**.
3. Substitua o conteúdo pelo arquivo `firestore.rules` do repositório e clique em **Publish**.
4. Abra **Build → Storage → Rules**.
5. Substitua o conteúdo pelo arquivo `storage.rules` do repositório e clique em **Publish**.

A regra do Firestore mantém o administrador principal com acesso garantido, permite que administradores ativos editem o conteúdo institucional e restringe a coleção `admins` para que apenas o administrador principal possa escrever nela. Cada usuário autenticado pode consultar somente o próprio documento para o painel confirmar sua autorização.

## Criar a conta do novo administrador

Se a pessoa ainda não possui conta, abra **Build → Authentication → Users**, clique em **Add user** e crie a conta com o e-mail que será utilizado no painel. Se a conta já existe, confirme que o e-mail está verificado.

Na tabela abaixo estão os dados que precisam ser conferidos antes da autorização.

| Campo | Onde conferir | Valor usado no painel |
|---|---|---|
| E-mail | Authentication → Users → coluna de e-mail | Digite o mesmo e-mail da conta |
| Nome | Informação institucional escolhida pela igreja | Digite no campo **Nome para identificação** |

## Autorizar pelo painel

1. Acesse [`admin.html`](https://assembleia-de-deus-diamantina.onrender.com/admin.html) com `hewertonluann@gmail.com`.
2. No menu lateral, abra **Administradores**.
3. Informe somente o e-mail da conta e, se desejar, informe o nome da pessoa.
4. Clique em **Autorizar administrador**.
5. Peça ao novo administrador para acessar o painel e entrar com e-mail/senha ou Google, usando exatamente a conta autorizada.

O registro inicial é criado com `ativo: true` e `papel: "admin"`. Para suspender temporariamente o acesso, use **Desativar**; para devolver o acesso, use **Ativar**. O botão **Remover** apaga apenas a autorização no Firestore e não exclui a conta do Firebase Authentication.

## Documento criado no Firestore

```json
{
  "email": "pastor@exemplo.com",
  "nome": "Nome do administrador",
  "ativo": true,
  "papel": "admin",
  "criadoEm": "serverTimestamp()",
  "atualizadoEm": "serverTimestamp()",
  "adicionadoPor": "hewertonluann@gmail.com"
}
```

O e-mail é convertido para minúsculas antes de ser gravado. Não é necessário consultar ou copiar o UID: as regras comparam o e-mail verificado da conta autenticada com o documento correspondente em `admins/{email}`.

## Validação realizada

O painel foi validado com o verificador de scripts HTML, o `node --check` do service worker e `git diff --check`. A página publicada foi inspecionada sem login: a marcação da área de administradores está disponível, mas o item do menu permanece oculto até a autenticação do administrador principal.

## Notícias e carrossel

Acesse **Notícias** no menu lateral do painel principal ou diretamente em `admin-noticias.html`. Crie uma notícia informando título, resumo, texto completo e imagem de capa. A imagem é enviada para o Firebase Storage em `img/noticias/` e o registro é salvo na coleção `noticias` do Firestore.

Para publicar a página completa, marque **Publicar no site**. Para exibir a notícia na seção de destaques da home, marque também **Exibir no carrossel da página inicial**. O campo **Ordem no carrossel** aceita números inteiros: quanto menor o número, mais cedo a notícia aparece; em caso de empate, a notícia mais recente aparece primeiro. O visitante acessa o detalhe em `noticia.html?id=...` ao clicar no slide.

O conteúdo do texto é tratado como texto seguro. Separe parágrafos com uma linha em branco; tags HTML digitadas no formulário não são interpretadas. Ao substituir ou excluir uma capa, o painel tenta remover o arquivo anterior do Storage para evitar sobras.
