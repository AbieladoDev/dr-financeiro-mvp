/**
 * O FORMULÁRIO DO MÉDICO — fixo, num arquivo só.
 *
 * ⚠️ RASCUNHO (01/10/2026): as perguntas abaixo foram montadas para o MVP
 * andar, não vieram do cliente. Trocar aqui é o único lugar: a tela pública,
 * a ficha no painel e o acompanhamento leem esta lista.
 *
 * Mudar o `id` de uma pergunta "perde" a resposta já gravada dela (o dado fica
 * no navegador, guardado por id). Para reescrever o texto, mexa só no `rotulo`.
 */

export type TipoDeCampo =
  | "texto"
  | "email"
  | "telefone"
  | "longo"
  | "escolha"
  | "multipla"

export interface Pergunta {
  id: string
  rotulo: string
  tipo: TipoDeCampo
  obrigatoria?: boolean
  /** Para `escolha` (uma) e `multipla` (várias). */
  opcoes?: string[]
  ajuda?: string
  placeholder?: string
}

export interface Secao {
  titulo: string
  perguntas: Pergunta[]
}

export const FORMULARIO: Secao[] = [
  {
    titulo: "Seus dados",
    perguntas: [
      { id: "nome", rotulo: "Nome completo", tipo: "texto", obrigatoria: true },
      { id: "crm", rotulo: "CRM / UF", tipo: "texto", placeholder: "12345 / RS" },
      { id: "especialidade", rotulo: "Especialidade", tipo: "texto" },
      { id: "telefone", rotulo: "WhatsApp", tipo: "telefone", obrigatoria: true },
      { id: "email", rotulo: "E-mail", tipo: "email" },
      { id: "cidade", rotulo: "Cidade onde atende", tipo: "texto" },
    ],
  },
  {
    titulo: "Como você trabalha",
    perguntas: [
      {
        id: "vinculo",
        rotulo: "Como você recebe pelo seu trabalho?",
        tipo: "multipla",
        obrigatoria: true,
        opcoes: ["CLT", "PJ (empresa própria)", "Autônomo (RPA / carnê-leão)", "Cooperativa", "Plantões"],
      },
      {
        id: "temPj",
        rotulo: "Você tem empresa (PJ) aberta?",
        tipo: "escolha",
        obrigatoria: true,
        opcoes: ["Sim", "Não", "Estou pensando em abrir"],
      },
      {
        id: "regime",
        rotulo: "Se tem PJ, qual o regime tributário?",
        tipo: "escolha",
        opcoes: ["Simples Nacional", "Lucro Presumido", "Não sei"],
      },
      {
        id: "renda",
        rotulo: "Renda bruta mensal aproximada",
        tipo: "escolha",
        obrigatoria: true,
        opcoes: ["Até R$ 15 mil", "R$ 15 a 30 mil", "R$ 30 a 60 mil", "Acima de R$ 60 mil"],
      },
    ],
  },
  {
    titulo: "O que você precisa",
    perguntas: [
      {
        id: "objetivos",
        rotulo: "Em que podemos ajudar?",
        tipo: "multipla",
        obrigatoria: true,
        opcoes: [
          "Pagar menos imposto",
          "Abrir ou ajustar minha PJ",
          "Organizar recebimentos",
          "Declaração de Imposto de Renda",
          "Investimentos",
          "Aposentadoria",
        ],
      },
      {
        id: "contador",
        rotulo: "Hoje você tem contador?",
        tipo: "escolha",
        opcoes: ["Sim", "Não"],
      },
      {
        id: "duvida",
        rotulo: "Conte sua dúvida ou situação",
        tipo: "longo",
        ajuda: "Quanto mais detalhe, melhor a nossa resposta.",
      },
    ],
  },
]

export const TODAS_AS_PERGUNTAS: Pergunta[] = FORMULARIO.flatMap((s) => s.perguntas)

/** Valor gravado: texto, ou lista para `multipla`. */
export type Valor = string | string[]
export type Respostas = Record<string, Valor>

/** Lista de perguntas obrigatórias sem resposta (vazio = pode enviar). */
export function faltando(respostas: Respostas): Pergunta[] {
  return TODAS_AS_PERGUNTAS.filter((p) => {
    if (!p.obrigatoria) return false
    const v = respostas[p.id]
    return Array.isArray(v) ? v.length === 0 : !v?.trim()
  })
}

/** O valor como texto, para a ficha e o acompanhamento. */
export function valorEmTexto(v: Valor | undefined): string {
  if (!v) return ""
  return Array.isArray(v) ? v.join(", ") : v
}
