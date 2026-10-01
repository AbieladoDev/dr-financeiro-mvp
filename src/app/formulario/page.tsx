"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  FORMULARIO,
  faltando,
  type Pergunta,
  type Respostas,
  type Valor,
} from "@/data/formulario"
import { maskPhone } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useDados } from "@/store/dados-store"

/**
 * O FORMULÁRIO PÚBLICO — o link que a empresa manda para o médico. Sem login.
 * Ao enviar, o médico vai para a página de acompanhamento dele, onde a
 * resposta da empresa aparece depois.
 */
export default function FormularioPage() {
  const router = useRouter()
  const enviar = useDados((s) => s.enviar)
  const [respostas, setRespostas] = React.useState<Respostas>({})
  const [enviando, setEnviando] = React.useState(false)

  function mudar(id: string, valor: Valor) {
    setRespostas((r) => ({ ...r, [id]: valor }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const pendentes = faltando(respostas)
    if (pendentes.length > 0) {
      toast.error(`Responda: ${pendentes.map((p) => p.rotulo).join(", ")}`)
      document.getElementById(`campo-${pendentes[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setEnviando(true)
    const envio = enviar(respostas)
    router.push(`/acompanhar/${envio.id}`)
  }

  return (
    <main className="min-h-svh bg-muted/40 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">Dr. Financeiro</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Conte um pouco sobre a sua vida financeira
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Leva uns 3 minutos. A nossa equipe analisa e responde por aqui mesmo.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {FORMULARIO.map((secao) => (
            <section key={secao.titulo} className="rounded-xl border bg-background p-4 md:p-6">
              <h2 className="mb-4 font-semibold">{secao.titulo}</h2>
              <div className="space-y-5">
                {secao.perguntas.map((p) => (
                  <Campo key={p.id} pergunta={p} valor={respostas[p.id]} onChange={(v) => mudar(p.id, v)} />
                ))}
              </div>
            </section>
          ))}

          <Button type="submit" size="lg" className="w-full" disabled={enviando}>
            Enviar respostas
          </Button>
        </form>
      </div>
    </main>
  )
}

function Campo({
  pergunta: p,
  valor,
  onChange,
}: {
  pergunta: Pergunta
  valor: Valor | undefined
  onChange: (v: Valor) => void
}) {
  const id = `campo-${p.id}`
  const rotulo = (
    <Label htmlFor={id} className="leading-snug">
      {p.rotulo}
      {p.obrigatoria && <span className="text-destructive"> *</span>}
    </Label>
  )

  if (p.tipo === "escolha" || p.tipo === "multipla") {
    const marcados = p.tipo === "multipla" ? ((valor as string[]) ?? []) : [valor as string]
    const alternar = (op: string) => {
      if (p.tipo === "escolha") onChange(valor === op ? "" : op)
      else onChange(marcados.includes(op) ? marcados.filter((m) => m !== op) : [...marcados, op])
    }
    return (
      <div id={id} className="space-y-2">
        {rotulo}
        {p.tipo === "multipla" && (
          <p className="text-xs text-muted-foreground">Pode marcar mais de uma.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {p.opcoes?.map((op) => {
            const ativo = marcados.includes(op)
            return (
              <button
                key={op}
                type="button"
                onClick={() => alternar(op)}
                aria-pressed={ativo}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  ativo
                    ? "border-transparent bg-foreground text-background"
                    : "bg-background hover:bg-muted"
                )}
              >
                {op}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const texto = (valor as string) ?? ""
  return (
    <div className="space-y-2">
      {rotulo}
      {p.tipo === "longo" ? (
        <Textarea
          id={id}
          rows={5}
          value={texto}
          maxLength={2000}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          type={p.tipo === "email" ? "email" : p.tipo === "telefone" ? "tel" : "text"}
          inputMode={p.tipo === "telefone" ? "tel" : undefined}
          placeholder={p.placeholder ?? (p.tipo === "telefone" ? "(51) 99999-9999" : undefined)}
          value={texto}
          maxLength={200}
          onChange={(e) => onChange(p.tipo === "telefone" ? maskPhone(e.target.value) : e.target.value)}
        />
      )}
      {p.ajuda && <p className="text-xs text-muted-foreground">{p.ajuda}</p>}
    </div>
  )
}
