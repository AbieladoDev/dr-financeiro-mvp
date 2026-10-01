# dr-financeiro-mvp

**Cliente / nicho:** Dr. Financeiro — empresa de consultoria financeira para médicos. MVP de
demonstração: a empresa manda um formulário para os médicos, eles respondem e a empresa devolve a
orientação. **Não está em produção.**
**Papel:** painel + formulário público (front-only, sem API)
**Irmãos:** nenhum (quando virar sistema: API no padrão Vetro/TodosDan)

## Banco
Não usa banco. Os dados vivem em `src/store/dados-store.ts` (zustand + `persist` no `localStorage`,
chaves `drfinanceiro-dados` e `drfinanceiro-sessao`), com dois envios de exemplo. Sem `.env`.

## Comandos
dev: `pnpm dev` · build: `pnpm build` · test: não há · lint: `pnpm lint` · migration: não se aplica

## Estrutura
- `src/data/formulario.ts` — **as perguntas, num arquivo só** (seções, tipos, obrigatórias). Tela
  pública, ficha e acompanhamento leem daqui.
- `src/app/login` — um acesso fixo (`ACESSO` no store), mostrado na própria tela. Não é segurança.
- `src/app/painel` — link do formulário para copiar + lista de envios; `painel/[id]` é a ficha com
  a resposta da empresa, o "Avisar no WhatsApp" e o "Ver como o médico vê".
- `src/app/formulario` — **público**, o link que vai para o médico.
- `src/app/acompanhar/[id]` — **público**, para onde o médico vai depois de enviar: "em análise"
  até a empresa responder, depois a resposta.

## Diferenças em relação ao template
Base de configuração copiada do `apae-mvp` (Next 16 + shadcn + zustand, front-only), mas **sem a
casca** (sidebar, header, módulos): é uma tela de lista e uma ficha, uma barra de cima basta. Só
os componentes `ui/` usados foram copiados. Paleta monocromática da todosDan-client, sem logo
(pedido do Arthur).

## Armadilhas
1. **Só front: o link mandado a um médico de verdade NÃO traz a resposta de volta.** O envio fica
   no navegador de quem preencheu. Para demonstrar, preencher o formulário no mesmo navegador do
   painel. Decisão do Arthur em 01/10/2026 — ver `DECISIONS.md`.
2. **As perguntas são rascunho** (montadas para o MVP andar). Trocar o `id` de uma pergunta
   "perde" a resposta já gravada dela; para mudar o texto, mexer só no `rotulo`.
3. Quem decide redirecionar espera `useHidratado()`: antes do `persist` ler o `localStorage`, todo
   mundo parece deslogado.
