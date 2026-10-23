import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import { useOpcoes } from "../hooks"
import { mensagemErro } from "../utils"
import { Carregando } from "../components/Estado"

const hoje = () => new Date().toISOString().slice(0, 10)
const VAZIO = { titulo: "", descricao: "", tipo: "", local: "", prioridade: "", data_abertura: hoje() }

// Mesmo componente para abrir (/novo) e editar (/editar/:id)
export default function Formulario() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()
  const { tipos, locais, prioridades, erro: erroOpcoes } = useOpcoes()
  const [form, setForm] = useState(VAZIO)
  const [carregando, setCarregando] = useState(editando)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [bloqueado, setBloqueado] = useState(false)

  useEffect(() => {
    if (!editando) return
    async function carregar() {
      try {
        const { data } = await api.get(`/chamados/${id}`)
        if (data.status === "resolvido") setBloqueado(true)
        setForm({
          titulo: data.titulo ?? "",
          descricao: data.descricao ?? "",
          tipo: data.tipo ?? "",
          local: data.local ?? "",
          prioridade: data.prioridade ?? "",
          data_abertura: data.data_abertura ?? hoje()
        })
      } catch (err) {
        setMensagem(mensagemErro(err))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id, editando])

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  async function salvar(e) {
    e.preventDefault()
    setSalvando(true)
    setMensagem("")
    try {
      const { data } = editando ? await api.put(`/chamados/${id}`, form) : await api.post("/chamados", form)
      navigate(`/chamado/${data.id ?? id}`)
    } catch (err) {
      setMensagem(mensagemErro(err))
      setSalvando(false)
    }
  }

  if (carregando) return <Carregando texto="Carregando chamado…" />

  const select = (campo, rotulo, lista) => (
    <label>
      {rotulo}
      <select value={form[campo]} onChange={mudar(campo)} required disabled={bloqueado}>
        <option value="">Selecione</option>
        {lista.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )

  return (
    <form className="formulario" onSubmit={salvar}>
      <h1>{editando ? "Editar chamado" : "Abrir chamado"}</h1>

      {bloqueado && <p className="mensagem erro">Chamados resolvidos não podem ser editados.</p>}
      {erroOpcoes && <p className="mensagem erro">Não foi possível carregar tipos, locais e prioridades.</p>}

      <label>
        Título
        <input value={form.titulo} onChange={mudar("titulo")} required disabled={bloqueado} />
      </label>
      <label>
        Descrição
        <textarea rows="4" value={form.descricao} onChange={mudar("descricao")} required disabled={bloqueado} />
      </label>
      <div className="duas-colunas">
        {select("tipo", "Tipo", tipos)}
        {select("local", "Local", locais)}
        {select("prioridade", "Prioridade", prioridades)}
        <label>
          Data de abertura
          <input type="date" value={form.data_abertura} onChange={mudar("data_abertura")} required disabled={bloqueado} />
        </label>
      </div>

      {mensagem && <p className="mensagem erro" role="alert">{mensagem}</p>}

      <div className="acoes">
        <button className="botao primario" disabled={salvando || bloqueado}>
          {salvando ? "Salvando…" : "Salvar"}
        </button>
        <Link to={editando ? `/chamado/${id}` : "/"} className="botao">Cancelar</Link>
      </div>
    </form>
  )
}
