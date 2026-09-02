# Gestão de Ministérios — AD Diamantina

## Acesso

O gerenciamento foi separado do painel principal para manter o `admin.html` mais leve. Acesse [`admin-ministerio.html`](https://assembleia-de-deus-diamantina.onrender.com/admin-ministerio.html) usando uma conta autorizada no Firebase Authentication. O administrador principal continua sendo `hewertonluann@gmail.com`; administradores adicionais precisam estar ativos na coleção `admins`.

Também existe um link **Ministérios** no menu lateral do [`admin.html`](https://assembleia-de-deus-diamantina.onrender.com/admin.html), que abre o painel dedicado.

## Cadastro

Clique em **Novo Ministério** e preencha o nome e a **Descrição do ministério**. A descrição explica o propósito e as atividades do ministério e aparece no topo da página pública. O identificador do link pode ficar vazio: nesse caso, o painel gera um slug a partir do nome. Esse slug aparece na URL da página individual e deve permanecer estável depois que o ministério já tiver sido divulgado.

A foto de fundo pode ser informada por uma URL pública ou enviada pelo próprio painel. Quando uma imagem é enviada, ela fica no Firebase Storage em `img/ministerios/{slug}/`, caminho compatível com a regra geral de imagens institucionais. A imagem deve ser JPG, PNG ou WEBP e ter até 10 MB. O texto alternativo deve descrever a imagem para usuários que utilizam leitores de tela.

Os campos **Dias de reunião** e **Dias de ensaio** aceitam texto com quebras de linha. Isso permite informar mais de um dia ou horário sem forçar um formato único. Na área **Exibição na página pública**, use os switches **Exibir dias de reunião** e **Exibir dias de ensaio** para controlar cada bloco separadamente. Desativar um switch oculta apenas o bloco correspondente e preserva o texto salvo para uso futuro. Em cadastros antigos sem essas flags, os dois blocos permanecem ativos por compatibilidade. No **Quadro de avisos**, use um aviso por linha; linhas vazias são ignoradas e o sistema publica no máximo vinte avisos.

A galeria aceita no máximo cinco fotos por ministério. As imagens podem ser selecionadas de uma vez ou adicionadas em etapas. O botão de remoção exclui a referência da galeria e, para arquivos enviados pelo painel, a imagem antiga também é removida do Storage depois que o cadastro é salvo.

## Página pública

Cada card da seção **Nossos Ministérios** passa a funcionar como um link para `ministerio.html?id={slug}`. Os cards usam a foto de fundo configurada e deixam a área central da imagem livre e clara. O nome fica em uma faixa separada na parte inferior, com o indicador de acesso à página individual. Sem imagem cadastrada, o card usa o gradiente institucional.

A página individual exibe a descrição, os blocos de dias de reunião e de ensaio conforme as opções de visibilidade salvas, o quadro de avisos e a galeria com visualizador. Quando uma informação ainda não foi cadastrada, a página mostra um estado informativo e não inventa dados. Se os dois blocos de programação forem desativados, a seção de programação inteira é ocultada.

## Modelo Firestore

As informações ficam no documento `site/ministerios`, no campo `lista`. Cada item pode conter:

```json
{
  "nome": "Ministério Infantil",
  "slug": "ministerio-infantil",
  "desc": "Descrição confirmada pela liderança.",
  "fotoFundoUrl": "https://...",
  "fotoFundoPath": "img/ministerios/ministerio-infantil/fundo.png",
  "fotoFundoAlt": "Atividade do Ministério Infantil",
  "reunioes": "Domingos, às 9h.",
  "ensaios": "Sábados, às 15h.",
  "mostrarReunioes": true,
  "mostrarEnsaios": true,
  "avisos": ["Aviso confirmado pela liderança."],
  "fotos": [
    { "url": "https://...", "path": "ministerios/ministerio-infantil/foto-0.jpg", "alt": "Encontro do ministério" }
  ]
}
```

Os uploads utilizam o caminho `img/ministerios/{slug}/`, que já está coberto pelo bloco `match /img/{allPaths=**}`. O arquivo `storage.rules` também mantém um bloco explícito para `ministerios/`, caso existam arquivos antigos nessa pasta; publique a versão atualizada no Firebase Console quando possível.
