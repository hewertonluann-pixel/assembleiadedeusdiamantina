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
```json
{
  "eventos": [
    { "data": "15/05", "titulo": "Congresso de Jovens", "local": "Sede Central" },
    { "data": "22/05", "titulo": "Culto de Missões", "local": "Sede Central" }
  ]
}
```

### `site/ministerios`
```json
{
  "lista": [
    { "nome": "Ministério Infantil", "desc": "Descrição do ministério..." },
    { "nome": "Ministério de Jovens", "desc": "Descrição do ministério..." }
  ]
}
```

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

Cada documento representa uma congregação:

```json
{
  "nome": "Congregação Jardim das Pedras",
  "endereco": "Rua das Flores, 45 – Jardim das Pedras",
  "cidade": "Diamantina – MG",
  "horario": "Domingo 18h | Quarta 19:30h",
  "foto": "https://link-para-imagem.jpg",
  "badge": "Congregação",
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
