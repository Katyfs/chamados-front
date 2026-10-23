// A API pode devolver lista pura ou um objeto com a lista dentro.
export function comoLista(dados) {
  if (Array.isArray(dados)) return dados
  return dados?.items ?? dados?.chamados ?? dados?.data ?? dados?.resultados ?? []
}

// /tipos, /locais e /prioridades: aceita strings ou objetos {nome/valor/id}.
export function comoOpcoes(dados) {
  const lista = Array.isArray(dados) ? dados : Object.values(dados ?? {}).find(Array.isArray) ?? []
  return lista.map((i) => (typeof i === "string" ? i : i.nome ?? i.valor ?? i.value ?? String(i.id)))
}

// Traduz os erros da API (400, 401, 404, 422) para uma frase legivel.
export function mensagemErro(err) {
  if (!err.response) return "Sem conexão com a API. Verifique sua internet."
  const { status, data } = err.response
  let detalhe = data?.detail
  if (Array.isArray(detalhe)) detalhe = detalhe.map((d) => d.msg ?? JSON.stringify(d)).join("; ")
  if (status === 401) return "Chave inválida. Confira o valor de VITE_API_KEY no arquivo .env."
  if (status === 404) return "Chamado não encontrado."
  return detalhe || `Erro ${status} ao falar com a API.`
}

export function formatarData(iso) {
  if (!iso) return "—"
  const [a, m, d] = iso.split("-")
  return `${d}/${m}/${a}`
}

export const STATUS = ["aberto", "em andamento", "resolvido"]
export const rotuloStatus = (s) => (s ?? "").replace(/_/g, " ")
export const classeStatus = (s) => (s ?? "").replace(/[_ ]/g, "-")
