"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, MessageCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RespostasDoMedico } from "@/components/respostas-do-medico"
import { SituacaoBadge } from "@/components/situacao-badge"
import { valorEmTexto } from "@/data/formulario"
import { formatDateTime, whatsappLink } from "@/lib/format"
import { ACESSO, useDados } from "@/store/dados-store"

/** A ficha de um envio: o que o médico respondeu e a resposta da empresa. */
export default function EnvioPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const envio = useDados((s) => s.envios.find((e) => e.id === id))
  const responder = useDados((s) => s.responder)
  const reabrir = useDados((s) => s.reabrir)
  const remover = useDados((s) => s.remover)
  // Inicial pelo texto já salvo: "Editar resposta" reabre com ele no campo.
  const [texto, setTexto] = React.useState(() => envio?.resposta?.texto ?? "")

  if (!envio) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <p className="font-medium">Envio não encontrado.</p>
        <Button variant="link" className="px-0" asChild>
          <Link href="/painel">Voltar para as respostas</Link>
        </Button>
      </div>
    )
  }

  const nome = valorEmTexto(envio.respostas.nome) || "Sem nome"
  const telefone = valorEmTexto(envio.respostas.telefone)
  const linkDoMedico = `/acompanhar/${envio.id}`

  function salvar() {
    if (!texto.trim()) {
      toast.error("Escreva a resposta antes de enviar")
      return
    }
    responder(envio!.id, texto, ACESSO.nome)
    toast.success("Resposta enviada — o médico vê pelo link dele")
  }

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link href="/painel">
          <ArrowLeft className="h-4 w-4" />
          Respostas
        </Link>
      </Button>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{nome}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recebido em {formatDateTime(envio.enviadoEm)} · protocolo{" "}
            <span className="font-mono">{envio.codigo}</span>
          </p>
        </div>
        <SituacaoBadge situacao={envio.situacao} />
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-xl border bg-background p-4 md:p-6">
          <h2 className="mb-4 font-semibold">Respostas do médico</h2>
          <RespostasDoMedico respostas={envio.respostas} />
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border bg-background p-4">
            <h2 className="font-semibold">Resposta da empresa</h2>

            {envio.situacao === "RESPONDIDA" && envio.resposta ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm whitespace-pre-line">{envio.resposta.texto}</p>
                <p className="text-xs text-muted-foreground">
                  {envio.resposta.por} · {formatDateTime(envio.resposta.em)}
                </p>
                <Button variant="outline" size="sm" onClick={() => reabrir(envio.id)}>
                  Editar resposta
                </Button>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <Label htmlFor="resposta" className="sr-only">
                  Resposta
                </Label>
                <Textarea
                  id="resposta"
                  rows={8}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Escreva a orientação para o médico..."
                />
                <Button className="w-full" onClick={salvar}>
                  Enviar resposta
                </Button>
              </div>
            )}
          </section>

          <section className="space-y-2 rounded-xl border bg-background p-4">
            <h2 className="font-semibold">Contato</h2>
            <p className="text-sm text-muted-foreground">
              O médico acompanha pelo link dele. Para avisar que respondeu:
            </p>
            {telefone && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a
                  href={whatsappLink(
                    telefone,
                    `Olá! Respondemos o seu formulário do Dr. Financeiro: ${typeof window !== "undefined" ? window.location.origin : ""}${linkDoMedico}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Avisar no WhatsApp
                </a>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href={linkDoMedico} target="_blank">
                <ExternalLink className="h-4 w-4" />
                Ver como o médico vê
              </Link>
            </Button>
          </section>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => {
              if (!window.confirm(`Remover o envio de ${nome}? Não dá para desfazer.`)) return
              remover(envio.id)
              toast.success("Envio removido")
              router.push("/painel")
            }}
          >
            <Trash2 className="h-4 w-4" />
            Remover envio
          </Button>
        </aside>
      </div>
    </div>
  )
}
