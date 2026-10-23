import { Routes, Route } from "react-router-dom"
import Cabecalho from "./components/Cabecalho.jsx"
import Home from "./pages/Home.jsx"
import Detalhe from "./pages/Detalhe.jsx"
import Formulario from "./pages/Formulario.jsx"

export default function App() {
  return (
    <>
      <Cabecalho />
      <main className="pagina">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chamado/:id" element={<Detalhe />} />
          <Route path="/novo" element={<Formulario />} />
          <Route path="/editar/:id" element={<Formulario />} />
          <Route path="*" element={<p className="estado">Página não encontrada.</p>} />
        </Routes>
      </main>
    </>
  )
}
