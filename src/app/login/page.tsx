"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ACESSO, useHidratado, useSessao } from "@/store/dados-store"

export default function LoginPage() {
  const router = useRouter()
  const pronto = useHidratado()
  const logado = useSessao((s) => s.logado)
  const entrar = useSessao((s) => s.entrar)
  const [email, setEmail] = React.useState("")
  const [senha, setSenha] = React.useState("")

  React.useEffect(() => {
    if (pronto && logado) router.replace("/painel")
  }, [pronto, logado, router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!entrar(email, senha)) {
      toast.error("E-mail ou senha inválidos")
      return
    }
    router.push("/painel")
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">Dr. Financeiro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Entre para ver as respostas dos médicos.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        {/* MVP de demonstração: o acesso fica à vista de propósito. */}
        <p className="mt-6 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          Acesso de demonstração: <span className="font-medium text-foreground">{ACESSO.email}</span> ·
          senha <span className="font-medium text-foreground">{ACESSO.senha}</span>
        </p>
      </div>
    </main>
  )
}
