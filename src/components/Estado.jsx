export function Carregando({ texto = "Carregando chamados…" }) {
  return (
    <div className="estado" role="status">
      <span className="spinner" aria-hidden="true" />
      {texto}
    </div>
  )
}

export function Vazio({ texto = "Nenhum chamado encontrado." }) {
  return <div className="estado">{texto}</div>
}

export function Erro({ texto }) {
  return (
    <div className="estado erro" role="alert">
      {texto}
    </div>
  )
}
