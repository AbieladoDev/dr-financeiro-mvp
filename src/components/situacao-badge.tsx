import { cn } from "@/lib/utils"
import type { Situacao } from "@/store/dados-store"

const ESTILO: Record<Situacao, { rotulo: string; classe: string }> = {
  NOVA: {
    rotulo: "Aguardando resposta",
    classe: "border-amber-300 bg-amber-50 text-amber-800",
  },
  RESPONDIDA: {
    rotulo: "Respondida",
    classe: "border-emerald-300 bg-emerald-50 text-emerald-800",
  },
}

export function SituacaoBadge({ situacao, className }: { situacao: Situacao; className?: string }) {
  const e = ESTILO[situacao]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        e.classe,
        className
      )}
    >
      {e.rotulo}
    </span>
  )
}
