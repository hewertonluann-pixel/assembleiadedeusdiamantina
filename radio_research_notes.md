# Pesquisa da Rádio Diamantina Gospel FM

## Fontes consultadas

- Página no Radios.com.br: https://www.radios.com.br/aovivo/radio-diamantina-gospel-fm/249014
- Site oficial informado pela página: https://radiogospeldiamantina.audiohd.com.br/

## Descobertas

A página do Radios.com.br é um diretório e não deve ser usada como URL de reprodução direta. Ela identifica a emissora como Rádio Diamantina Gospel FM, em Diamantina/MG, e aponta o site oficial `https://radiogospeldiamantina.audiohd.com.br/`.

No HTML do site oficial, o player jPlayer usa o seguinte atributo `data-mp3`:

`https://stm7.voxhd.com.br:6852/;`

Esse endpoint é a URL direta do stream de áudio que pode ser atribuída a um elemento `<audio>` no site da igreja. O site oficial também usa um player fixo no topo, com controles de play/pause, mute/volume e título/status da faixa.

O stream deve ser testado no navegador e em rede HTTPS antes da publicação, pois a reprodução depende da disponibilidade do servidor, do formato aceito pelo navegador e de políticas de CORS/autoplay. O clique do usuário no botão Play deve iniciar a reprodução; o site não deve tentar tocar automaticamente com som.

## Teste local do miniplayer

A home local (`http://127.0.0.1:8000/index.html?radio-test=1`) renderiza sem erro de estrutura e mantém os controles existentes. O miniplayer compartilha o markup esperado e pode ser ativado por `site:radio-config`; a primeira tentativa de console falhou por parsing do caractere `;` no stream, e a segunda execução corrigida foi aceita pelo navegador. O player permanece dependente da configuração `radioStream` do Firestore, que ainda não foi salva no documento público durante o teste.

A imagem local continua exibindo o estado legado do iframe do YouTube quando não há vídeo específico configurado; isso é independente do miniplayer da rádio.

## Validação visual local

Com a configuração simulada, o miniplayer aparece no canto inferior esquerdo, acima dos controles fixos existentes, com botão de play, volume, link externo e ocultar. O layout não cobre o botão de contribuição/PIX nem o WhatsApp no viewport desktop testado.

O painel local carrega a seção `Redes Sociais`; a inspeção textual confirmou o formulário e a integração dos campos `radioPage` e `radioStream`. A validação pública dos novos campos dependerá da publicação e do salvamento do documento `site/redes`.

## Revalidação após correção de corrida

A home local foi reaberta com a versão ajustada e a configuração simulada foi enviada novamente. O componente continua inicializando sem erro e conserva o fluxo esperado; sem `radioStream` gravado no Firestore, o player permanece oculto por design. A configuração precisa ser salva pelo painel para aparecer no ambiente público.
