# PWA — Assembleia de Deus Ministério de Diamantina

O site público é um Progressive Web App (PWA) instalável em navegadores compatíveis. A implementação mantém o site estático em HTML, CSS e JavaScript e acrescenta os recursos mínimos necessários para instalação e uso offline parcial.

## Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `manifest.webmanifest` | Nome, cores, rota inicial, modo standalone e ícones do aplicativo. |
| `service-worker.js` | Cache do app shell, fallback offline das páginas públicas e limpeza de versões antigas. |
| `js/pwa.js` | Registro do service worker em HTTPS ou localhost e atualização controlada. |
| `icons/icon-192.png` | Ícone principal para instalação em 192×192 px. |
| `icons/icon-512.png` | Ícone principal para instalação em 512×512 px. |

## Escopo do offline

O service worker mantém no cache a estrutura principal da home, da listagem de congregações e do perfil de congregação, além dos arquivos estáticos necessários ao layout. Se o visitante estiver sem conexão, essas páginas podem abrir com o conteúdo HTML previamente armazenado.

Os dados do Firebase Firestore, as imagens hospedadas no Firebase Storage, o YouTube, a rádio ao vivo e os demais serviços externos continuam dependendo de conexão. O service worker não intercepta requisições para outros domínios nem tenta inventar dados offline.

## Atualizações

A versão do cache é definida no início de `service-worker.js` por `CACHE_VERSION`. Quando arquivos estruturais forem alterados de maneira importante, incremente esse valor, por exemplo de `ad-diamantina-pwa-v1` para `ad-diamantina-pwa-v2`. Na próxima abertura, o navegador instala o novo cache e remove a versão anterior.

## Instalação

Em navegadores compatíveis, abra o site publicado em HTTPS e use a opção **Instalar aplicativo**, **Adicionar à tela inicial** ou equivalente no menu do navegador. No Android, a opção normalmente aparece no menu do Chrome. No computador, ela costuma aparecer como um ícone de instalação na barra de endereço ou no menu do navegador.

No iPhone e iPad, abra o site no Safari, toque em **Compartilhar**, escolha **Adicionar à Tela de Início** e confirme. O Safari utiliza o `apple-touch-icon` configurado no HTML.

## Ícone da aba e ícone instalado

O favicon da aba pode ser alterado pelo painel em **Imagens do Site → Ícone da Aba (Favicon)**. Esse upload atualiza o campo `site/imagens.favicon` e as páginas públicas passam a usar a URL configurada.

O ícone do aplicativo instalado é mantido pelos arquivos versionados em `icons/`, porque o manifest é um arquivo estático. Se a igreja escolher uma nova identidade para o ícone instalado, atualize os PNGs, incremente `CACHE_VERSION` e publique uma nova versão.

## Requisitos

A instalação depende de o site estar publicado em HTTPS, de o manifest estar acessível e de o navegador oferecer suporte a PWAs. O endereço publicado do projeto atende ao requisito de HTTPS: <https://assembleia-de-deus-diamantina.onrender.com/>.

Para referências gerais sobre os padrões usados, consulte a documentação do [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) e de [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).
