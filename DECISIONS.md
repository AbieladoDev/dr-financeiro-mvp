# DECISIONS — dr-financeiro-mvp

## 2026-10-01 — MVP só front, formulário fixo, resposta no link do médico
**Decidido:** front-only como o `apae-mvp` (zustand + `localStorage`), um formulário fixo em
`src/data/formulario.ts`, um login fixo, e o médico acompanha a resposta em `/acompanhar/[id]`
(para onde é levado ao enviar). A empresa ainda tem "Avisar no WhatsApp" na ficha.
**Por quê:** é demonstração do fluxo para o cliente; o Arthur pediu "coisa simples".
**Rejeitado:** (a) Next + Prisma no Postgres da casa — faria o link funcionar entre aparelhos, mas
não foi a escolha para esta fase; (b) API NestJS separada — grande demais para o MVP; (c) a empresa
montar as próprias perguntas — formulário fixo basta para validar.
**Consequência aceita:** o link só funciona no mesmo navegador do painel. Para mandar a médicos de
verdade, precisa de backend.
