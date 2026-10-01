/** "29/09/2026 14:20" no fuso de quem está vendo. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Máscara de celular/fixo: (51) 99999-9999. */
export function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ""
  const ddd = d.slice(0, 2)
  const resto = d.slice(2)
  if (resto.length <= 4) return `(${ddd}) ${resto}`
  const corte = resto.length === 9 ? 5 : 4
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`
}

/** Link do WhatsApp para o número (só dígitos, com 55). */
export function whatsappLink(telefone: string, texto?: string): string {
  const d = telefone.replace(/\D/g, "")
  const numero = d.startsWith("55") ? d : `55${d}`
  return `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`
}
