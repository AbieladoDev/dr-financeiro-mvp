import { redirect } from "next/navigation"

/** A raiz não tem conteúdo: quem chega aqui é a empresa, que vai para o login. */
export default function Home() {
  redirect("/login")
}
