import { useEffect, useState } from "react"
import api from "./services/api"
import { comoOpcoes } from "./utils"

// Carrega /tipos, /locais e /prioridades uma vez.
export function useOpcoes() {
  const [opcoes, setOpcoes] = useState({ tipos: [], locais: [], prioridades: [] })
  const [erro, setErro] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        const [t, l, p] = await Promise.all([api.get("/tipos"), api.get("/locais"), api.get("/prioridades")])
        setOpcoes({ tipos: comoOpcoes(t.data), locais: comoOpcoes(l.data), prioridades: comoOpcoes(p.data) })
      } catch {
        setErro(true)
      }
    }
    carregar()
  }, [])

  return { ...opcoes, erro }
}
