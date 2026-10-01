"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Copy, ExternalLink, Inbox } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SituacaoBadge } from "@/components/situacao-badge"
import { valorEmTexto } from "@/data/formulario"
import { formatDateTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useDados, type Situacao } from "@/store/dados-store"

const nadaParaAssinar = () => () => {}

type Filtro = "TODAS" | Situacao

const FILTROS: { chave: Filtro; rotulo: string }[] = [
  { chave: "NOVA", rotulo: "Aguardando" },
  { chave: "RESPONDIDA", rotulo: "Respondidas" },
  { chave: "TODAS", rotulo: "Todas" },
]

export default function PainelPage() {
  const router = useRouter()
  const envios = useDados((s) => s.envios)
  const [filtro, setFiltro] = React.useState<Filtro>("NOVA")
  // `window` só existe no navegador: no servidor o link sai vazio.
  const linkFormulario = React.useSyncExternalStore(
    nadaParaAssinar,
    () => `${window.location.origin}/formulario`,
    () => ""
  )

  const visiveis = filtro === "TODAS" ? envios : envios.filter((e) => e.situacao === filtro)
  const contagem = (f: Filtro) =>
    f === "TODAS" ? envios.length : envios.filter((e) => e.situacao === f).length

  async function copiar() {
    try {
      await navigator.clipboard.writeText(linkFormulario)
      toast.success("Link copiado — é só mandar para o médico")
    } catch {
      toast.error("Não foi possível copiar. Selecione o link e copie à mão.")
    }
  }

  return (
    <div className="space-y-6">
      {/* O link é a razão de existir do painel: fica no topo. */}
      <section className="rounded-xl border bg-background p-4 md:p-5">
        <h2 className="font-semibold">Link do formulário</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mande este link para os médicos. Cada resposta aparece aqui embaixo.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input readOnly value={linkFormulario} className="font-mono text-sm" />
          <div className="flex gap-2">
            <Button onClick={copiar} disabled={!linkFormulario}>
              <Copy className="h-4 w-4" />
              Copiar
            </Button>
            <Button variant="outline" asChild>
              <Link href="/formulario" target="_blank">
                <ExternalLink className="h-4 w-4" />
                Abrir
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-semibold">Respostas dos médicos</h1>
          <div className="flex gap-1.5">
            {FILTROS.map((f) => (
              <button
                key={f.chave}
                type="button"
                onClick={() => setFiltro(f.chave)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  filtro === f.chave
                    ? "border-transparent bg-foreground text-background"
                    : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                {f.rotulo} <span className="tabular-nums opacity-70">{contagem(f.chave)}</span>
              </button>
            ))}
          </div>
        </div>

        {visiveis.length === 0 ? (
          <Empty className="rounded-xl border bg-background">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Inbox />
              </EmptyMedia>
              <EmptyTitle>
                {filtro === "NOVA" ? "Nada aguardando resposta" : "Nenhuma resposta ainda"}
              </EmptyTitle>
              <EmptyDescription>
                {envios.length === 0
                  ? "Copie o link acima e mande para os médicos."
                  : "Troque o filtro para ver as outras."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-background">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Médico</TableHead>
                  <TableHead className="hidden md:table-cell">Especialidade</TableHead>
                  <TableHead className="hidden md:table-cell">Recebido em</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiveis.map((e) => (
                  <TableRow
                    key={e.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/painel/${e.id}`)}
                  >
                    <TableCell className="pl-4">
                      <div className="font-medium">{valorEmTexto(e.respostas.nome) || "Sem nome"}</div>
                      <div className="text-xs text-muted-foreground">
                        {valorEmTexto(e.respostas.telefone)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {valorEmTexto(e.respostas.especialidade) || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDateTime(e.enviadoEm)}
                    </TableCell>
                    <TableCell>
                      <SituacaoBadge situacao={e.situacao} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  )
}
