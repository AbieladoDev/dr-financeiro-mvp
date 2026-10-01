"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { CheckCircle2, Clock } from "lucide-react"

import { RespostasDoMedico } from "@/components/respostas-do-medico"
import { formatDateTime } from "@/lib/format"
import { useDados, useHidratado } from "@/store/dados-store"

/**
 * O ACOMPANHAMENTO DO MÉDICO — para onde ele vai depois de enviar. Enquanto a
 * empresa não responde, diz que está em análise; depois, mostra a resposta.
 *
 * ⚠️ MVP só front: esta página só encontra o envio no MESMO navegador em que
 * o formulário foi preenchido.
 */
export default function AcompanharPage() {
  const { id } = useParams<{ id: string }>()
  const pronto = useHidratado()
  const envio = useDados((s) => s.envios.find((e) => e.id === id))

  if (!pronto) return null

  return (
    <main className="min-h-svh bg-muted/40 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        <p className="text-sm font-medium text-muted-foreground">Dr. Financeiro</p>

        {!envio ? (
          <div className="rounded-xl border bg-background p-6">
            <h1 className="text-lg font-semibold">Não encontramos este envio</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Confira o link que você recebeu ao enviar o formulário.
            </p>
          </div>
        ) : (
          <>
            {envio.resposta ? (
              <section className="rounded-xl border border-emerald-200 bg-background p-5 md:p-6">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <h1 className="text-lg font-semibold">Nossa resposta</h1>
                </div>
                <p className="mt-3 text-sm whitespace-pre-line">{envio.resposta.texto}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {envio.resposta.por} · {formatDateTime(envio.resposta.em)}
                </p>
              </section>
            ) : (
              <section className="rounded-xl border bg-background p-5 md:p-6">
                <div className="flex items-center gap-2 text-amber-700">
                  <Clock className="h-5 w-5" />
                  <h1 className="text-lg font-semibold">Recebemos suas respostas</h1>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  A nossa equipe vai analisar e responder aqui. Guarde este link para voltar depois.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Protocolo <span className="font-mono font-medium text-foreground">{envio.codigo}</span>{" "}
                  · enviado em {formatDateTime(envio.enviadoEm)}
                </p>
              </section>
            )}

            <section className="rounded-xl border bg-background p-5 md:p-6">
              <h2 className="mb-4 font-semibold">O que você respondeu</h2>
              <RespostasDoMedico respostas={envio.respostas} />
            </section>
          </>
        )}
      </div>
    </main>
  )
}
