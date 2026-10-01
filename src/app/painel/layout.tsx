"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useHidratado, useSessao } from "@/store/dados-store"

/** Casca do painel: barra de cima e a guarda de login. */
export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pronto = useHidratado()
  const logado = useSessao((s) => s.logado)
  const sair = useSessao((s) => s.sair)

  React.useEffect(() => {
    if (pronto && !logado) router.replace("/login")
  }, [pronto, logado, router])

  // Antes de hidratar não se sabe se está logado; não pisca o painel.
  if (!pronto || !logado) return null

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/painel" className="font-semibold tracking-tight">
            Dr. Financeiro
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              sair()
              router.push("/login")
            }}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  )
}
