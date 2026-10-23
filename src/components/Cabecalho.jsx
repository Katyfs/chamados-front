import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { mensagemErro } from "../utils"

export default function Cabecalho() {
  const [nome, setNome] = useState("")
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await api.get("/eu")
        setNome(data.nome ?? data.name ?? data.aluno ?? data.dono ?? "")
      } catch (err) {
        setErro(mensagemErro(err))
      }
    }
    carregar()
  }, [])

  return (
    <header className="cabecalho">
      <div className="cabecalho-linha">
        <Link to="/" className="marca">
          <span className="tachinha" aria-hidden="true" />
          Quadro de Reparos
        </Link>
        <span className="saudacao" title={erro}>{erro ? "Chave não reconhecida" : nome ? `Olá, ${nome}` : ""}</span>
      </div>
    </header>
  )
}