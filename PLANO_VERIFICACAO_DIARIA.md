# Plano de verificação gradual e atualização da memória do site

## Objetivo

Revisar o site em unidades pequenas, registrar o que foi confirmado, corrigir inconsistências somente quando houver evidência e manter um arquivo de memória coerente para futuras sessões. Cada execução diária deve consumir uma única etapa, produzir evidências e atualizar o estado do plano.

## Regras de execução

1. Trabalhar somente na etapa do dia; não tentar revisar o site inteiro.
2. Antes de alterar código, registrar o arquivo, o comportamento observado e a causa provável.
3. Separar achados em `confirmado`, `a investigar` e `corrigido`.
4. Não modificar dados do Firestore nem fazer uploads sem autorização específica.
5. Após cada etapa, atualizar o arquivo de memória com data, arquivos examinados, resultado, pendências e próximos passos.
6. Fazer commit separado por etapa, com mensagem clara; não misturar correções funcionais com documentação.
7. Priorizar acessibilidade, segurança, funcionamento mobile/PWA e disponibilidade das imagens.

## Calendário sugerido — uma etapa por dia

| Dia | Etapa | Escopo principal | Entrega esperada |
|---|---|---|---|
| 1 | Inventário e baseline | árvore de arquivos, páginas, dependências externas, estado Git e URLs públicas | inventário atualizado e lista de riscos |
| 2 | Páginas públicas | `index.html`, `igreja.html`, navegação, links internos, carregamento inicial | checklist de navegação e erros encontrados |
| 3 | Congregações | `congregacoes.html`, `congregacao.html`, `js/congregacoes.js`, imagens, mapas e slugs | diagnóstico de cards, perfis e fallback de imagens |
| 4 | Agenda e mídia | eventos, banners, galeria, rádio e links externos | verificação de datas, assets e responsividade |
| 5 | Ministérios e notícias | `ministerio.html`, páginas de notícia e scripts associados | verificação de conteúdo, links e imagens |
| 6 | Administração — congregações | `admin.html`, CRUD de congregações, upload e pré-visualizações | mapa dos fluxos administrativos e riscos |
| 7 | Administração — conteúdo | `admin-noticias.html`, `admin-ministerio.html`, `admin-igreja.html` | checklist de edição, permissões e persistência |
| 8 | Firebase e segurança | `firebase-client.js`, `firestore.rules`, `storage.rules`, consultas e Storage | matriz de permissões e dependências do faturamento |
| 9 | PWA e cache | manifest, service worker, ícones, cache e comportamento offline | relatório de instalação, atualização e cache |
| 10 | CSS e mobile | folhas de estilo, breakpoints, overflow, imagens e acessibilidade visual | lista priorizada de problemas de layout |
| 11 | Testes integrados | fluxos públicos e administrativos que possam ser testados sem mutações perigosas | roteiro reproduzível de testes |
| 12 | Memória e backlog | consolidar descobertas, decisões, correções, pendências e próximos ciclos | arquivo de memória completo e backlog priorizado |

## Modelo de registro diário

```markdown
### AAAA-MM-DD — Etapa N: título
- Arquivos examinados:
- Verificações executadas:
- Confirmado:
- Problemas encontrados:
- Correções aplicadas:
- Evidências/URLs:
- Pendências:
- Próximo passo:
```

## Critérios de conclusão

A etapa só deve ser marcada como concluída quando os arquivos do escopo tiverem sido examinados, os achados forem classificados, os testes relevantes forem registrados e o arquivo de memória tiver sido atualizado. O ciclo inteiro termina quando não houver pendências sem responsável/ação e quando o backlog estiver priorizado por impacto.

## Prioridades já conhecidas

1. **Alta:** indisponibilidade do Firebase Storage anteriormente observada com HTTP 402 por faturamento delinquent; revalidar antes de qualquer alteração de URLs.
2. **Alta:** confirmar que as páginas públicas não exibem imagens quebradas quando o Storage está indisponível.
3. **Média:** documentar a estratégia de URLs amigáveis para congregações, sem quebrar os links antigos com `congregacao.html?id=...`.
4. **Média:** validar service worker e cache após mudanças de arquivos estáticos.
5. **Baixa:** revisar protótipos e documentação depois que o caminho principal estiver estável.
