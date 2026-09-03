# Firestore — Estrutura de Dados

Este projeto usa o Firebase Firestore para armazenar e servir conteúdo dinâmico.

## Coleção: `admins` (acesso privado)

Cada documento usa o **e-mail normalizado da conta no Firebase Authentication como ID**. A coleção não é pública: o administrador principal pode gerenciá-la, e cada usuário autenticado pode consultar apenas o próprio documento para que o painel confirme a autorização.

### `admins/{email}`
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

A conta principal `hewertonluann@gmail.com` mantém acesso por regra de segurança, mesmo sem documento nesta coleção. Contas adicionais somente podem editar o conteúdo quando o documento correspondente ao seu e-mail normalizado existir e tiver `ativo: true`; apenas a conta principal pode criar, alterar ou remover documentos em `admins`.

---

## Coleção: `site` (documentos fixos)

### `site/home`
```json
{
  "verse": "João 3:16",
  "title": "Assembleia de Deus\nDiamantina",
  "subtitle": "Uma família que glorifica a Deus",
  "sobre_p1": "Parágrafo 1 sobre a igreja...",
  "sobre_p2": "Parágrafo 2 sobre a igreja...",
  "whatsappFloatEnabled": true,
  "contributionFloatEnabled": false,
  "cultos": [
    { "label": "Domingo – EBD", "hora": "09:00h" },
    { "label": "Domingo – Culto", "hora": "18:00h" },
    { "label": "Quarta – Culto de Ensino", "hora": "19:30h" }
  ]
}
```

Os campos `whatsappFloatEnabled` e `contributionFloatEnabled` controlam os botões flutuantes da home. O primeiro é ativado por padrão para manter o comportamento anterior, mas o botão só aparece se houver um número de WhatsApp em `site/redes`. O segundo vem desativado por padrão e só aparece quando for ativado no painel e houver chave Pix, nome e cidade do recebedor em `site/contribuicao`.

### `site/igreja`

Este documento é editado em `admin-igreja.html` e controla os textos da página pública `igreja.html`. Se o documento ainda não existir, a página usa os textos padrão já presentes no HTML até que o primeiro salvamento seja realizado.

```json
{
  "heroBadge": "Conheça nossa história",
  "heroTitle": "A Igreja",
  "heroDescription": "Conheça os fundamentos que orientam a Assembleia de Deus Ministério de Diamantina.",
  "aboutBadge": "Nossa identidade",
  "aboutTitle": "Uma comunidade de fé, amor e esperança",
  "aboutParagraph1": "Primeiro parágrafo institucional...",
  "aboutParagraph2": "Segundo parágrafo institucional...",
  "missionTitle": "Missão",
  "missionText": "Pregar o Evangelho e fazer discípulos de Jesus Cristo.",
  "visionTitle": "Visão",
  "visionText": "Ser uma igreja que transforma vidas e impacta Diamantina.",
  "valuesTitle": "Valores",
  "valuesText": "Fé, família, comunhão e serviço ao próximo.",
  "inviteBadge": "Faça parte",
  "inviteTitle": "Caminhe conosco",
  "inviteText": "Encontre um horário de culto, conheça nossas congregações e acompanhe a programação do Ministério de Diamantina.",
  "cultosButton": "Ver cultos",
  "congregacoesButton": "Ver congregações",
  "atualizadoEm": "serverTimestamp()"
}
```

A foto principal exibida nesta página continua sendo o campo `igreja` de `site/imagens`, gerenciado na aba **Imagens do Site** do painel principal. O documento `site/igreja` é público para leitura e protegido para gravação pelas regras de administrador.

### `site/lideranca`
```json
{
  "presidente": {
    "nome": "",
    "funcao": "Pastor Presidente",
    "bio": "",
    "fotoUrl": "",
    "alt": ""
  },
  "obreiros": [
    {
      "nome": "",
      "funcao": "",
      "local": "",
      "fotoUrl": "",
      "alt": ""
    }
  ],
  "atualizadoEm": "serverTimestamp()"
}
```

O documento começa vazio. O presidente aparece no Hero apenas quando pelo menos um campo oficial estiver preenchido; cada obreiro só é exibido quando tiver nome, função ou foto. Fotos são armazenadas no Firebase Storage em `img/lideranca/presidente-*` e `img/lideranca/obreiro-*`.

### `site/agenda`

O documento mantém `eventos` como uma lista. Eventos novos usam datas ISO (`YYYY-MM-DD`) em `dataInicio` e `dataFim`; para eventos de um único dia, os dois campos recebem a mesma data. O campo `data` continua sendo gravado como texto de compatibilidade com registros antigos.

```json
{
  "eventos": [
    {
      "id": "evento-1750000000000-ab12cd",
      "data": "15/05–17/05",
      "dataInicio": "2026-05-15",
      "dataFim": "2026-05-17",
      "titulo": "Congresso de Jovens",
      "local": "Sede Central",
      "congregacaoId": "id-do-documento-da-congregacao",
      "congregacaoNome": "Assembleia de Deus",
      "congregacaoBadge": "Sede",
      "descricao": "Programação oficial confirmada pela igreja.",
      "cartazUrl": "https://firebasestorage.googleapis.com/...",
      "cartazPath": "img/agenda/evento-1750000000000-ab12cd-1750000000000.png",
      "cartazAlt": "Cartaz do Congresso de Jovens",
      "ativo": true
    }
  ]
}
```

`congregacaoId` é a referência estável ao documento em `congregacoes/{id}` e é o único campo usado para filtrar eventos na página da congregação. `congregacaoNome` permanece como o nome institucional fixo `Assembleia de Deus`; `congregacaoBadge` identifica a unidade, como `Sede` ou `Pedra Grande`. O painel também consegue recuperar o badge diretamente do documento da congregação, mantendo compatibilidade com eventos antigos. `cartazUrl` e `cartazPath` são preenchidos pelo upload do painel. O arquivo é armazenado em `img/agenda/`, respeitando as regras de imagem do Firebase Storage. Registros antigos que tenham apenas `data`, `titulo` e `local` continuam sendo exibidos; ao editá-los, o painel preserva a data legada até que datas inicial e final sejam informadas.

### `site/ministerios`

O documento mantém uma lista de ministérios. O `slug` é o identificador estável usado na URL de `ministerio.html`; quando não informado no cadastro, ele é gerado a partir do nome. `fotos` aceita no máximo cinco objetos e as imagens enviadas pelo painel ficam no Storage em `img/ministerios/{slug}/`, caminho já coberto pelas regras gerais de imagens institucionais.

```json
{
  "lista": [
    {
      "nome": "Ministério Infantil",
      "slug": "ministerio-infantil",
      "desc": "Descrição do ministério...",
      "fotoFundoUrl": "https://...",
      "fotoFundoPath": "img/ministerios/ministerio-infantil/fundo.png",
      "fotoFundoAlt": "Crianças do ministério infantil",
      "reunioes": "Domingos, às 9h.",
      "ensaios": "Sábados, às 15h.",
      "mostrarReunioes": true,
      "mostrarEnsaios": true,
      "acoes": [
        { "label": "Canal no YouTube", "url": "https://youtube.com/...", "newTab": true }
      ],
      "avisos": ["Aviso confirmado pela liderança."],
      "fotos": [
        { "url": "https://...", "path": "img/ministerios/ministerio-infantil/foto-0.jpg", "alt": "Encontro do ministério" }
      ]
    }
  ],
  "atualizadoEm": "serverTimestamp()"
}
```

O campo legado `icone`, quando existir em registros antigos, não é mais exibido nem solicitado pelo painel e é removido na próxima gravação. Os campos `fotoFundoUrl`, `fotoFundoPath`, `fotoFundoAlt`, `reunioes`, `ensaios`, `mostrarReunioes`, `mostrarEnsaios`, `avisos` e `fotos` são opcionais. As flags `mostrarReunioes` e `mostrarEnsaios` controlam separadamente a exibição dos cartões correspondentes; quando ausentes em registros antigos, são tratadas como `true`. Desativar uma flag oculta o bloco público sem apagar o texto salvo. `acoes` é uma lista opcional de até quatro botões; cada item possui `label`, `url` e `newTab`. O painel e a página pública aceitam somente destinos HTTP ou HTTPS, e os links abertos em nova aba recebem proteção `noopener noreferrer`. Sem foto de fundo, o card usa o gradiente institucional; sem avisos, fotos ou ações, a página pública não inventa conteúdo.

### `site/imagens`
```json
{
  "logo": "https://.../img/logo.png",
  "hero": "https://.../img/hero-bg.jpg",
  "igreja": "https://.../img/igreja.jpg",
  "favicon": "https://.../img/favicon.png",
  "favicon192": "https://.../img/favicon-192.png",
  "favicon512": "https://.../img/favicon-512.png"
}
```

**Campos de favicon**: `favicon` é o PNG original usado como ícone da aba do navegador. `favicon192` e `favicon512` são gerados automaticamente pelo painel em versões quadradas de 192×192 e 512×512 px e são usados como ícones do aplicativo instalado pelo PWA. Os arquivos ficam em `img/favicon.png`, `img/favicon-192.png` e `img/favicon-512.png`. Enquanto o upload não existir ou estiver indisponível, as páginas usam `favicon.svg` e o manifest usa os ícones locais em `icons/` como fallback.

### `site/redes`
```json
{
  "instagram": "https://instagram.com/seu_usuario",
  "facebook": "https://facebook.com/sua_pagina",
  "youtube": "https://youtube.com/@seu_canal",
  "youtubeVideo": "https://www.youtube.com/watch?v=VIDEO_ID",
  "radioPage": "https://www.radios.com.br/aovivo/radio-diamantina-gospel-fm/249014",
  "radioStream": "https://stm7.voxhd.com.br:6852/;",
  "whatsapp": "5538999999999"
}
```

**Campo `youtubeVideo`**: URL opcional de um vídeo específico do YouTube que será exibido no player em destaque da home. O link do canal permanece no campo `youtube`.

**Campos `radioPage` e `radioStream`**: `radioPage` é a página pública da emissora, usada no botão de acesso externo. `radioStream` é a URL direta do áudio, usada pelo elemento `<audio>` do miniplayer. A página do Radios.com.br, sozinha, não é uma fonte reproduzível pelo navegador.

### `site/contato`
```json
{
  "rua": "Rua Direita, 123",
  "bairro": "Centro",
  "cidade": "Diamantina – MG",
  "cep": "39100-000",
  "maps": "https://www.google.com/maps/embed?pb=..."
}
```

---

## Coleção: `congregacoes` (um documento por congregação)

Cada documento representa uma unidade da Assembleia de Deus. O campo `nome` é mantido como `Assembleia de Deus`; o campo `badge` diferencia a unidade publicamente, por exemplo `Sede` ou `Pedra Grande`.

```json
{
  "nome": "Assembleia de Deus",
  "endereco": "Rua das Flores, 45 – Jardim das Pedras",
  "cidade": "Diamantina – MG",
  "horario": "Domingo 18h | Quarta 19:30h",
  "foto": "https://link-para-imagem.jpg",
  "badge": "Pedra Grande",
  "maps": "Rua das Flores 45 Diamantina MG",
  "ordem": 1
}
```

**Campo `maps`**: use o endereço completo para busca no Google Maps, ou o embed URL.
**Campo `ordem`**: número inteiro para definir a ordem de exibição dos cards.
**Campo `foto`**: URL de uma imagem da congregação. Se omitido, usa imagem automática.

### `site/contribuicao`
```json
{
  "pixKeyType": "aleatoria",
  "pixKey": "chave Pix oficial",
  "receiverName": "Nome oficial do recebedor",
  "receiverCity": "Diamantina",
  "qrCode": "https://.../img/pix-qr.png",
  "note": "Mensagem opcional de orientação"
}
```

A seção pública de contribuição só é exibida quando `pixKey`, `receiverName`, `receiverCity` e `qrCode` estiverem preenchidos. Enquanto os dados oficiais não forem informados, o painel pode salvar a estrutura incompleta sem publicar uma chave ou QR Code incorretos.


### `noticias/{id}`

Cada notícia é um documento individual. A coleção pode ser lida publicamente, mas só administradores autorizados podem criar, editar ou remover documentos. O painel grava as imagens no Firebase Storage em `img/noticias/` e guarda a URL pública e o caminho para permitir a substituição ou remoção do arquivo antigo.

```json
{
  "titulo": "Culto de celebração reúne famílias em Diamantina",
  "slug": "culto-de-celebracao-reune-familias-em-diamantina",
  "categoria": "Comunidade",
  "autor": "Comunicação AD Diamantina",
  "dataPublicacao": "2026-09-01",
  "resumo": "Uma frase de contexto para o card e para o início da notícia.",
  "conteudo": "Primeiro parágrafo.\n\nSegundo parágrafo.",
  "imagemUrl": "https://firebasestorage.googleapis.com/...",
  "imagemPath": "img/noticias/noticia-1750000000000-ab12cd-1750000000000.jpg",
  "imagemAlt": "Descrição objetiva da imagem da notícia",
  "ordemCarrossel": 0,
  "publicado": true,
  "exibirNoCarrossel": true,
  "criadoEm": "serverTimestamp()",
  "atualizadoEm": "serverTimestamp()"
}
```

A página `index.html` exibe apenas notícias com `publicado == true`, `exibirNoCarrossel != false`, título, resumo e imagem válida; os oito primeiros resultados são ordenados por `ordemCarrossel`, data de publicação decrescente e título. A página `noticia.html?id={id}` exige que a notícia esteja publicada e renderiza o conteúdo como texto seguro, separando parágrafos por linhas em branco.
