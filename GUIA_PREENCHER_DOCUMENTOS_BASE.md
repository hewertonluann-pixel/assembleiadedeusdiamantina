# Guia para preencher os documentos-base pelo painel

As regras de segurança já foram publicadas e o acesso administrativo foi validado. Agora use o painel em:

[https://assembleia-de-deus-diamantina.onrender.com/admin.html](https://assembleia-de-deus-diamantina.onrender.com/admin.html)

Entre com **Entrar com Google** usando `hewertonluann@gmail.com`.

O objetivo desta etapa é criar ou completar os documentos `site/home`, `site/contato` e `site/redes`, que são os documentos responsáveis pela maior parte do conteúdo atualmente exibido como fallback ou “Carregando…”. O painel grava esses documentos no Firestore quando você clica em **Salvar**.

## 1. Página Inicial

No menu lateral, clique em **Página Inicial**. Como o documento ainda não estava completo, os campos podem aparecer vazios. Preencha com o conteúdo institucional já utilizado na home atual:

| Campo do painel | Valor sugerido para a primeira publicação |
|---|---|
| Versículo (topo) | `“Porque Deus amou o mundo de tal maneira...” — João 3:16` |
| Título principal | `Bem-vindo à Assembleia de Deus Ministério de Diamantina` |
| Subtítulo | `Uma comunidade de fé, amor e esperança no coração de Diamantina, MG.` |
| Parágrafo 1 | `A Assembleia de Deus Ministério de Diamantina foi fundada em 07 de julho de 2009, com o propósito de proclamar o evangelho de Jesus Cristo no coração de Diamantina e região.` |
| Parágrafo 2 | `Sob a liderança do Pr. Airton Vitorino da Silva, nossa igreja cresce em fé, servindo à comunidade com amor, palavra e oração.` |

Na área **Horários de Culto**, deixe quatro linhas:

| Descrição | Horário |
|---|---|
| `Domingo Manhã` | `08h30` |
| `Domingo Noite` | `19h00` |
| `Terça-feira` | `19h00` |
| `Quinta-feira` | `19h00` |

Clique em **Salvar**. Aguarde a mensagem **“Página inicial atualizada!”**. Depois abra a home em outra aba e recarregue com `Ctrl+F5`.

> Se algum texto ou horário não estiver mais correto, não use o valor sugerido. Substitua pelo conteúdo oficial confirmado pela liderança da igreja.

## 2. Contato e mapa

No menu lateral, clique em **Contato & Mapa**. Preencha:

| Campo do painel | Valor inicial observado no site |
|---|---|
| Rua e número | `Rua Getúlio Vargas, 235` |
| Bairro | `Vila Operária` |
| Cidade - UF | `Diamantina - MG` |
| CEP | `39100-000` |

O campo **URL do embed do Google Maps** não deve receber simplesmente o endereço da página do Google Maps. Para obter a URL correta:

1. Acesse [https://www.google.com/maps](https://www.google.com/maps).
2. Pesquise `Rua Getúlio Vargas, 235, Diamantina - MG`.
3. Clique em **Compartilhar**.
4. Escolha a aba **Incorporar um mapa**.
5. Selecione o tamanho desejado.
6. Clique em **Copiar HTML**.
7. No código copiado, encontre o valor que aparece entre `src="` e o próximo `"` dentro do elemento `iframe`.
8. Cole somente essa URL no campo do painel.

Exemplo de formato esperado:

```text
https://www.google.com/maps/embed?pb=...
```

Não use um exemplo inventado no lugar do valor real. Clique em **Salvar** e confirme **“Contato atualizado!”**.

## 3. Redes sociais e WhatsApp

No menu lateral, clique em **Redes Sociais**. Use os endereços oficiais que já aparecem atualmente no site para a primeira sincronização:

| Campo | Valor atual observado |
|---|---|
| Instagram | `https://www.instagram.com/assembleiadeusm.diamantina/` |
| Facebook | `https://www.facebook.com/Assembleiadedeusdiamantina/` |
| YouTube | `https://www.youtube.com/channel/UC9t7CLXW1SuLNhTmD6LexRg?view_as=subscriber` |
| Vídeo em destaque | URL opcional de um vídeo específico, por exemplo `https://www.youtube.com/watch?v=...` |
| WhatsApp | Deixe vazio até a liderança definir o número oficial. |

O campo **YouTube** continua sendo o endereço do canal. O campo **Vídeo em destaque** é separado e deve receber a URL pública de um vídeo específico; o site converterá automaticamente links `watch?v=...`, `youtu.be/...` ou URLs `/embed/...` para o player. Se o campo ficar vazio, a home exibirá um convite para abrir o canal, sem tentar carregar um iframe inválido.

Confirme com a liderança antes de salvar se esses canais continuam oficiais. O campo WhatsApp deve ficar vazio até a definição do número oficial. Clique em **Salvar**.

## 4. Rádio ao vivo

Na mesma seção **Redes Sociais**, preencha os campos da rádio:

| Campo | Valor recomendado |
|---|---|
| Página da rádio | `https://www.radios.com.br/aovivo/radio-diamantina-gospel-fm/249014` |
| URL direta do áudio | `https://stm7.voxhd.com.br:6852/;` |

A **Página da rádio** é usada pelo ícone de acesso externo do miniplayer. A **URL direta do áudio** é a que permite ao botão Play reproduzir a transmissão no site. Não troque os dois valores: a página do Radios.com.br não é uma fonte de áudio direta.

O miniplayer aparece depois que a URL direta estiver salva e oferece play/pause, volume, link externo e ocultar. A reprodução começa somente após o visitante clicar em Play, respeitando as políticas do navegador. Se o stream estiver temporariamente indisponível, o player exibirá uma mensagem de erro sem interromper o restante do site.

Clique em **Salvar** e confirme **“Redes sociais atualizadas!”**. Depois recarregue a home com `Ctrl+F5`.

## 5. Contribuição via Pix

No menu lateral, clique em **Contribuição**. A página foi preparada para receber os dados oficiais sem publicar nada enquanto a configuração estiver incompleta.

Preencha somente quando a liderança confirmar:

| Campo | Orientação |
|---|---|
| Tipo de chave | Aleatória, e-mail, telefone, CPF ou CNPJ. |
| Chave Pix | Valor exato da chave oficial. |
| Nome do recebedor | Nome que deve aparecer para conferência. |
| Cidade do recebedor | Cidade registrada para a cobrança Pix. |
| QR Code | Faça upload do QR Code gerado pelo banco ou instituição financeira. |
| Mensagem | Texto opcional de orientação aos membros. |

A seção pública só aparece quando chave, nome, cidade e QR Code estiverem preenchidos. Antes disso, o site não mostrará uma chave incompleta nem um QR Code placeholder. O QR Code deve ser selecionado diretamente no navegador; não envie chaves privadas, senhas ou tokens por mensagem.

Depois de preencher, clique em **Salvar contribuição**. A página pública exibirá a seção de dízimo e oferta com QR Code, chave copiável e aviso para conferir o recebedor no aplicativo do banco.

## 6. Ministérios

No menu lateral, clique em **Ministérios**. A home já encontrou cinco ministérios no Firestore, mas quase todos estão sem descrição. Não invente descrições. Para cada ministério, abra **Editar** e preencha uma descrição curta fornecida pela igreja:

| Nome observado | Conteúdo que precisa ser confirmado |
|---|---|
| Jovens (UMADEMID) | Objetivo, faixa etária e dia/horário de reunião. |
| Infantil | Público atendido, atividades e responsável. |
| Adolescentes | Público atendido, atividades e responsável. |
| Louvor e Adoração | Objetivo do ministério e forma de participação. |
| Orquestra Filhos de Asafe | Objetivo, ensaios e contato. |

Também confirme os ícones antes de alterá-los. O campo de ícone usa classes do Font Awesome, como `fa-users`, mas a descrição oficial é mais importante que o ícone.

## 7. Agenda

No menu lateral, clique em **Agenda**. Não crie eventos fictícios. Para cada evento real, clique em **Novo Evento** e preencha:

| Campo | Como preencher |
|---|---|
| Data inicial | Primeiro dia do evento, usando o seletor de data. |
| Data final | Último dia do evento. Para um evento de um dia, use a mesma data da inicial. |
| Título | Nome oficial, por exemplo `Congresso de Jovens`. |
| Local | Endereço ou congregação, por exemplo `Sede — Rua Getúlio Vargas, 235`. |
| Descrição | Somente informações confirmadas pela igreja. |
| Cartaz | Envie o PNG, JPG ou WEBP oficial, com no máximo 10 MB. |
| Texto alternativo | Descrição breve do cartaz para acessibilidade. |

Na página pública, um evento de vários dias aparece como intervalo, por exemplo `15–17 Jun`, e o cartaz aparece como miniatura clicável. Se ainda não houver evento confirmado, mantenha a agenda vazia para a home mostrar **“Nenhum evento programado no momento”**.

## 8. Imagens do site

No menu lateral, clique em **Imagens do Site**. Esta seção ainda depende de arquivos oficiais que não estão no repositório. Não faça upload de imagens aleatórias ou sem autorização.

Os quatro arquivos podem ser configurados nesta seção:

| Slot | Recomendação |
|---|---|
| Logo da Igreja | PNG ou WEBP com fundo transparente, se disponível. |
| Imagem de Fundo (Hero) | JPG/WEBP, preferencialmente com pelo menos 1920×1080 px. |
| Foto da Igreja (Sobre) | Fachada ou interior, com autorização de uso. |
| Ícone da Aba (Favicon) | Somente PNG, preferencialmente quadrado em 512×512 px, com o símbolo ou a versão reduzida da logo. |

Selecione um arquivo, aguarde o botão **Fazer upload** ficar habilitado, clique nele e aguarde a confirmação. O upload criará ou atualizará `site/imagens`. No caso do favicon, o arquivo original será salvo como `img/favicon.png` e o painel também gerará automaticamente `img/favicon-192.png` e `img/favicon-512.png`. Assim, o mesmo PNG passa a ser usado na aba do navegador, no ícone de instalação e no ícone da tela inicial do iPhone/iPad. Depois de trocar o arquivo, atualize ou reinstale o PWA para o sistema operacional substituir um ícone antigo armazenado. Use somente um PNG oficial e autorizado pela igreja.

## 9. Ordem para testar depois de salvar

Depois de preencher os documentos, abra estas páginas e atualize com `Ctrl+F5`:

1. [Home](https://assembleia-de-deus-diamantina.onrender.com/)
2. [Congregações](https://assembleia-de-deus-diamantina.onrender.com/congregacoes.html)
3. [Perfil da Sede](https://assembleia-de-deus-diamantina.onrender.com/congregacao.html?id=LDEcEyP2nciVPLlNcWqK)
4. [Perfil Pedra Grande](https://assembleia-de-deus-diamantina.onrender.com/congregacao.html?id=AFH2Bw3KjLjJQNEISaen)

Verifique principalmente se o rodapé deixa de mostrar **“Carregando…”**, se endereço e cultos aparecem na listagem e se os textos da home correspondem aos valores salvos.

## 10. O que não deve ser alterado nesta etapa

Não altere as regras do Firestore nem do Storage pelo painel. Não crie contas administrativas adicionais sem definir antes uma política de acesso. Não exclua congregações ou ministérios existentes. Não publique eventos, imagens, telefones, horários, PIX ou descrições que não tenham sido confirmados pela liderança.

Se um campo estiver vazio, salve somente o que estiver confirmado. Um campo vazio tratado corretamente é preferível a uma informação institucional inventada.
