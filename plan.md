# Editor rico de notícias

## Implementação

Adicionar ao `admin-noticias.html` o SunEditor 3.4.3, com barra de ferramentas para negrito, itálico, sublinhado, títulos, listas, alinhamento, tamanho de fonte, cor, links, limpeza de formatação, inserção e redimensionamento de imagens. As imagens internas serão enviadas ao Firebase Storage dentro de `img/noticias/conteudo/`, reaproveitando a autenticação e as regras existentes.

O campo `conteudo` continuará sendo usado no Firestore, mas passará a armazenar HTML sanitizado. Notícias legadas em texto puro serão convertidas automaticamente para parágrafos ao abrir e também continuarão sendo interpretadas corretamente na página pública. A página pública usará um sanitizador próprio com whitelist para evitar que HTML ou atributos perigosos sejam executados.

## Estrutura

- `admin-noticias.html`: carregamento fixado do SunEditor, configuração da toolbar, upload de imagens e integração com Firestore/Storage.
- `css/admin-noticias.css`: aparência responsiva do SunEditor integrada ao tema do painel.
- `js/noticia.js`: conversão de conteúdo legado e sanitização/renderização pública.
- `css/noticia.css`: estilos para títulos, listas, links e imagens inseridos no corpo da notícia.

## Direção visual

- **Editorial institucional** (0,06): barra compacta, controles claros e acabamento alinhado ao painel atual.
- **Minimalista utilitária** (0,07): foco em controles pequenos e máxima densidade.
- **Cartão moderno** (0,05): controles agrupados em uma superfície destacada.

Escolha: **Editorial institucional**. O editor reutiliza as cores, bordas e tipografia do painel, com estados de foco visíveis e layout que se adapta ao celular.
