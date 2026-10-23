import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { useOpcoes } from "../hooks"
import { comoLista, mensagemErro, formatarData, classeStatus, STATUS } from "../utils"
import { Carregando, Vazio, Erro } from "../components/Estado"
import { SeloStatus, SeloPrioridade } from "../components/Selo"

const FILTROS_VAZIOS = { status: "", tipo: "", local: "", prioridade: "" }

export default function Home() {
  const { tipos, locais, prioridades } = useOpcoes()
  const [busca, setBusca] = useState("")
  const [buscaAplicada, setBuscaAplicada] = useState("")
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)
  const [chamados, setChamados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  // espera o usuario parar de digitar antes de buscar
  useEffect(() => {
    const t = setTimeout(() => setBuscaAplicada(busca), 350)
    return () => clearTimeout(t)
  }, [busca])

  useEffect(() => {
    let ativo = true
    async function carregar() {
      setCarregando(true)
      setErro("")
      try {
        const params = { ...filtros, busca: buscaAplicada }
        Object.keys(params).forEach((k) => !params[k] && delete params[k])
        const { data } = await api.get("/chamados", { params })
        if (ativo) setChamados(comoLista(data))
      } catch (err) {
        if (ativo) setErro(mensagemErro(err))
      } finally {
        if (ativo) setCarregando(false)
      }
    }
    carregar()
    return () => {
      ativo = false
    }
  }, [filtros, buscaAplicada])

  const mudar = (campo) => (e) => setFiltros({ ...filtros, [campo]: e.target.value })
  const temFiltro = busca || Object.values(filtros).some(Boolean)

  return (
    <>
      <div className="topo-lista">
        <h1>Chamados</h1>
        <Link to="/novo" className="botao primario">
          Abrir chamado
        </Link>
      </div>

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por título ou descrição"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar chamados"
        />
        <select value={filtros.status} onChange={mudar("status")} aria-label="Filtrar por status">
          <option value="">Todos os status</option>
          {STATUS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={filtros.tipo} onChange={mudar("tipo")} aria-label="Filtrar por tipo">
          <option value="">Todos os tipos</option>
          {tipos.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <select value={filtros.local} onChange={mudar("local")} aria-label="Filtrar por local">
          <option value="">Todos os locais</option>
          {locais.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <select value={filtros.prioridade} onChange={mudar("prioridade")} aria-label="Filtrar por prioridade">
          <option value="">Todas as prioridades</option>
          {prioridades.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      {carregando && <Carregando />}
      {!carregando && erro && <Erro texto={erro} />}
      {!carregando && !erro && chamados.length === 0 && (
        <Vazio texto={temFiltro ? "Nenhum chamado encontrado com esses filtros. Limpe a busca ou troque os filtros." : "Nenhum chamado encontrado. Abra o primeiro."} />
      )}

      {!carregando && !erro && chamados.length > 0 && (
        <ul className="lista">
          {chamados.map((c) => (
            <li key={c.id}>
              <Link to={`/chamado/${c.id}`} className={`ficha status-${classeStatus(c.status)}`}>
                <span className="ficha-titulo">{c.titulo}</span>
                <span className="ficha-meta">
                  {c.tipo} · {c.local} · {formatarData(c.data_abertura)}
                </span>
                <span className="ficha-selos">
                  <SeloStatus status={c.status} />
                  <SeloPrioridade prioridade={c.prioridade} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
