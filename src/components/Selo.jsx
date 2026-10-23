import { rotuloStatus, classeStatus } from "../utils"

export function SeloStatus({ status }) {
  return <span className={`selo status-${classeStatus(status)}`}>{rotuloStatus(status)}</span>
}

export function SeloPrioridade({ prioridade }) {
  return <span className={`selo prioridade-${prioridade}`}>{prioridade}</span>
}
