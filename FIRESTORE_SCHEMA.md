# Firestore — Estrutura de Dados

Este projeto usa o Firebase Firestore para armazenar e servir conteúdo dinâmico.

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
  "cultos": [
    { "label": "Domingo – EBD", "hora": "09:00h" },
    { "label": "Domingo – Culto", "hora": "18:00h" },
    { "label": "Quarta – Culto de Ensino", "hora": "19:30h" }
  ]
}
```

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

### `site/redes`
```json
{
  "instagram": "https://instagram.com/seu_usuario",
  "facebook": "https://facebook.com/sua_pagina",
  "youtube": "https://youtube.com/@seu_canal",
  "youtubeVideo": "https://www.youtube.com/watch?v=VIDEO_ID",
  "whatsapp": "5538999999999"
}
```

**Campo `youtubeVideo`**: URL opcional de um vídeo específico do YouTube que será exibido no player em destaque da home. O link do canal permanece no campo `youtube`.

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
