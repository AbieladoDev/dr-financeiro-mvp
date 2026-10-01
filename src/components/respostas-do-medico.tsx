import { FORMULARIO, valorEmTexto, type Respostas } from "@/data/formulario"

/**
 * O que o médico respondeu, seção por seção. O mesmo componente serve à ficha
 * no painel e ao acompanhamento do médico — os dois leem a lista de
 * `data/formulario.ts`, então pergunta nova aparece nos dois.
 */
export function RespostasDoMedico({ respostas }: { respostas: Respostas }) {
  return (
    <div className="space-y-5">
      {FORMULARIO.map((secao) => (
        <section key={secao.titulo}>
          <h3 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {secao.titulo}
          </h3>
          <dl className="divide-y rounded-lg border">
            {secao.perguntas.map((p) => {
              const texto = valorEmTexto(respostas[p.id])
              return (
                <div key={p.id} className="grid gap-1 px-3 py-2.5 sm:grid-cols-[14rem_1fr] sm:gap-4">
                  <dt className="text-sm text-muted-foreground">{p.rotulo}</dt>
                  <dd className="text-sm whitespace-pre-line">
                    {texto || <span className="text-muted-foreground">—</span>}
                  </dd>
                </div>
              )
            })}
          </dl>
        </section>
      ))}
    </div>
  )
}
