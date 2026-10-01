"use client"

import * as React from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Respostas } from "@/data/formulario"

/**
 * O "BANCO" DO MVP — zustand persistido no navegador, como no `apae-mvp`.
 *
 * ⚠️ Só existe NESTE navegador. O link do formulário mandado a um médico de
 * verdade não traz a resposta de volta: para isso o MVP precisa de API. Os
 * nomes das ações (`enviar`, `responder`) foram pensados para virar endpoints.
 */

export type Situacao = "NOVA" | "RESPONDIDA"

export interface Envio {
  id: string
  /** Código curto que o médico vê no acompanhamento. */
  codigo: string
  enviadoEm: string
  respostas: Respostas
  situacao: Situacao
  resposta: { texto: string; em: string; por: string } | null
}

interface DadosState {
  envios: Envio[]
  enviar: (respostas: Respostas) => Envio
  responder: (id: string, texto: string, por: string) => void
  /** Volta para NOVA mantendo o texto — para corrigir uma resposta. */
  reabrir: (id: string) => void
  remover: (id: string) => void
}

function novoId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function novoCodigo(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

/** Dois envios de exemplo, para o painel não abrir vazio na demonstração. */
const EXEMPLOS: Envio[] = [
  {
    id: "exemplo-1",
    codigo: "A7K2QX",
    enviadoEm: "2026-09-29T14:20:00.000Z",
    situacao: "RESPONDIDA",
    respostas: {
      nome: "Dra. Mariana Lopes",
      crm: "28411 / RS",
      especialidade: "Pediatria",
      telefone: "(51) 99812-3344",
      email: "mariana.lopes@example.com",
      cidade: "Porto Alegre",
      vinculo: ["CLT", "Plantões"],
      temPj: "Estou pensando em abrir",
      regime: "",
      renda: "R$ 15 a 30 mil",
      objetivos: ["Pagar menos imposto", "Abrir ou ajustar minha PJ"],
      contador: "Não",
      duvida: "Faço plantões em dois hospitais e recebo como autônoma. Vale a pena abrir PJ?",
    },
    resposta: {
      texto:
        "Olá, Dra. Mariana! Pelo seu volume de plantões, a PJ no Simples tende a reduzir bastante a carga. Vamos te chamar no WhatsApp para fazer a simulação com os seus números.",
      em: "2026-09-30T10:05:00.000Z",
      por: "Equipe Dr. Financeiro",
    },
  },
  {
    id: "exemplo-2",
    codigo: "M3T9PL",
    enviadoEm: "2026-09-30T19:42:00.000Z",
    situacao: "NOVA",
    respostas: {
      nome: "Dr. Rafael Cunha",
      crm: "31277 / RS",
      especialidade: "Ortopedia",
      telefone: "(51) 99654-7788",
      email: "",
      cidade: "Canoas",
      vinculo: ["PJ (empresa própria)"],
      temPj: "Sim",
      regime: "Lucro Presumido",
      renda: "Acima de R$ 60 mil",
      objetivos: ["Investimentos", "Aposentadoria"],
      contador: "Sim",
      duvida: "Tenho sobra de caixa na PJ todo mês e não sei a melhor forma de tirar e investir.",
    },
    resposta: null,
  },
]

export const useDados = create<DadosState>()(
  persist(
    (set) => ({
      envios: EXEMPLOS,

      enviar: (respostas) => {
        const envio: Envio = {
          id: novoId(),
          codigo: novoCodigo(),
          enviadoEm: new Date().toISOString(),
          respostas,
          situacao: "NOVA",
          resposta: null,
        }
        set((s) => ({ envios: [envio, ...s.envios] }))
        return envio
      },

      responder: (id, texto, por) =>
        set((s) => ({
          envios: s.envios.map((e) =>
            e.id === id
              ? {
                  ...e,
                  situacao: "RESPONDIDA",
                  resposta: { texto: texto.trim(), em: new Date().toISOString(), por },
                }
              : e
          ),
        })),

      reabrir: (id) =>
        set((s) => ({
          envios: s.envios.map((e) => (e.id === id ? { ...e, situacao: "NOVA" } : e)),
        })),

      remover: (id) => set((s) => ({ envios: s.envios.filter((e) => e.id !== id) })),
    }),
    { name: "drfinanceiro-dados" }
  )
)

// ----------------------------------------------------------------- sessão

/**
 * Login do MVP: UM acesso, escrito aqui. Não é segurança — o dado nem sai do
 * navegador. Existe para a demonstração ter a porta de entrada.
 */
export const ACESSO = { email: "admin@drfinanceiro.com", senha: "123456", nome: "Equipe Dr. Financeiro" }

interface SessaoState {
  logado: boolean
  entrar: (email: string, senha: string) => boolean
  sair: () => void
}

export const useSessao = create<SessaoState>()(
  persist(
    (set) => ({
      logado: false,
      entrar: (email, senha) => {
        const ok = email.trim().toLowerCase() === ACESSO.email && senha === ACESSO.senha
        if (ok) set({ logado: true })
        return ok
      },
      sair: () => set({ logado: false }),
    }),
    { name: "drfinanceiro-sessao" }
  )
)

/**
 * O `persist` lê o localStorage DEPOIS do primeiro render: antes disso todo
 * mundo parece deslogado e sem dados. Quem decide redirecionar espera isto.
 */
export function useHidratado(): boolean {
  return React.useSyncExternalStore(assinarHidratacao, estaHidratado, () => false)
}

function estaHidratado(): boolean {
  return useSessao.persist.hasHydrated() && useDados.persist.hasHydrated()
}

function assinarHidratacao(avisar: () => void): () => void {
  const a = useSessao.persist.onFinishHydration(avisar)
  const b = useDados.persist.onFinishHydration(avisar)
  return () => {
    a()
    b()
  }
}
