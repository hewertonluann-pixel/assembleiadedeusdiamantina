# Validação inicial da seção de Ministérios

A prévia local de `ministerio.html?id=infantil` foi aberta em 25/08/2026. O layout carregou a navegação pública, o breadcrumb, o hero do ministério, os blocos de programação e a galeria.

Como o registro atual não possui horários, avisos ou fotos avançadas, a página exibiu corretamente os estados vazios sem inventar informações: “Informação ainda não cadastrada” para reuniões e ensaios e “Nenhuma foto foi publicada...” para a galeria. O documento público é encontrado a partir do `slug` derivado do nome.

## Validação inicial do painel dedicado

A prévia local de `admin-ministerio.html` exibiu a tela de login separada. A inspeção do DOM confirmou a existência do editor e dos campos de nome, descrição, ícone, URL/upload de fundo, reuniões, ensaios, avisos e galeria. O contador da galeria inicia em `0/5`.

## Verificação em produção

Após o push do commit `767c38b`, as URLs públicas `ministerio.html`, `admin-ministerio.html` e `css/admin-ministerio.css` responderam com HTTP 200. A página `ministerio.html?id=infantil` foi aberta em produção e exibiu o mesmo estado vazio seguro da prévia local: programação sem dados cadastrados e galeria sem fotos, sem conteúdo inventado.

## Correção do spinner

A causa foi identificada no CSS: `.ministerio-loading` definia `display: flex`, e o atributo HTML `hidden` sozinho não conseguia sobrescrever essa regra. Foi adicionada uma regra explícita para `.ministerio-loading[hidden]`, além dos estados de conteúdo e não encontrado, usando `display: none !important`.

A prévia local de `ministerio.html?id=orquestra-filhos-de-asafe&fix=v29` foi validada em 25/08/2026. O conteúdo carregou com a foto do ministério e quatro fotos da galeria, enquanto o spinner não permaneceu visível. O console não apresentou erro JavaScript; apenas informou que uma nova versão do service worker será utilizada na próxima abertura.
