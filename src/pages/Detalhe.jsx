import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import { mensagemErro, formatarData } from "../utils"
import { Carregando, Erro } from "../components/Estado"
import { SeloStatus, SeloPrioridade } from "../components/Selo"

export default function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chamado, setChamado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [confirmando, setConfirmando] = useState(false)
  const [entrada, setEntrada] = useState("") // responsavel ou solucao
  const [enviando, setEnviando] = useState(false)
  const [erroAcao, setErroAcao] = useState("")

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro("")
      try {
        const { data } = await api.get(`/chamados/${id}`)
        setChamado(data)
      } catch (err) {
        setErro(mensagemErro(err))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  async function avancar(e) {
    e.preventDefault()
    setEnviando(true)
    setErroAcao("")
    try {
      const iniciar = chamado.status === "aberto"
      const rota = iniciar ? "iniciar" : "resolver"
      const corpo = iniciar ? { responsavel: entrada } : { solucao: entrada }
      const { data } = await api.patch(`/chamados/${id}/${rota}`, corpo)
      setChamado(data)
      setEntrada("")
    } catch (err) {
      setErroAcao(mensagemErro(err))
    } finally {
      setEnviando(false)
    }
  }

  async function excluir() {
    setEnviando(true)
    setErroAcao("")
    try {
      await api.delete(`/chamados/${id}`)
      navigate("/")
    } catch (err) {
      setErroAcao(mensagemErro(err))
      setConfirmando(false)
      setEnviando(false)
    }
  }

  if (carregando) return <Carregando texto="Carregando chamado…" />
  if (erro)
    return (
      <>
        <Link to="/" className="voltar">← Voltar</Link>
        <Erro texto={erro} />
      </>
    )

  const resolvido = chamado.status === "resolvido"
  const aberto = chamado.status === "aberto"

  return (
    <>
      <Link to="/" className="voltar">← Voltar</Link>

      <article className="detalhe">
        <h1>{chamado.titulo}</h1>
        <div className="ficha-selos">
          <SeloStatus status={chamado.status} />
          <SeloPrioridade prioridade={chamado.prioridade} />
        </div>

        <dl className="campos">
          <dt>Descrição</dt><dd>{chamado.descricao || "—"}</dd>
          <dt>Tipo</dt><dd>{chamado.tipo}</dd>
          <dt>Local</dt><dd>{chamado.local}</dd>
          <dt>Aberto em</dt><dd>{formatarData(chamado.data_abertura)}</dd>
          <dt>Responsável</dt><dd>{chamado.responsavel || "—"}</dd>
          <dt>Solução</dt><dd>{chamado.solucao || "—"}</dd>
          {resolvido && (<><dt>Resolvido em</dt><dd>{formatarData(chamado.data_resolucao)}</dd></>)}
        </dl>

        {erroAcao && <Erro texto={erroAcao} />}

        {confirmando ? (
          <div className="confirmacao" role="alertdialog">
            <p>Tem certeza que deseja excluir este chamado? Isso não pode ser desfeito.</p>
            <div className="acoes">
              <button className="botao perigo" onClick={excluir} disabled={enviando}>Excluir</button>
              <button className="botao" onClick={() => setConfirmando(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="acoes">
            {!resolvido && <Link to={`/editar/${id}`} className="botao">Editar</Link>}
            <button className="botao perigo-contorno" onClick={() => setConfirmando(true)}>Excluir</button>
          </div>
        )}

        {!resolvido && (
          <form className="etapa" onSubmit={avancar}>
            <h2>Próxima etapa</h2>
            <p className="dica">
              {aberto ? "Informe quem assumiu o atendimento para iniciá-lo." : "Descreva o que foi feito para resolver o chamado."}
            </p>
            <div className="etapa-linha">
              <input
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder={aberto ? "Responsável" : "Solução"}
                aria-label={aberto ? "Responsável" : "Solução"}
                required
              />
              <button className="botao primario" disabled={enviando}>
                {aberto ? "Iniciar atendimento" : "Resolver chamado"}
              </button>
            </div>
          </form>
        )}
      </article>
    </>
  )
}
