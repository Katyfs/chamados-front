# Plaqueta · Front-end do Sistema de Chamados de Manutenção IFRN

Front-end em React + Vite que consome a API de chamados de manutenção do IFRN
(`https://api-chamados.jefersonqueiroga.com.br`).

![Tela inicial](./docs/tela-inicial.png)

## Funcionalidades

- Nome do dono da chave no topo (`GET /eu`)
- Lista de chamados com busca por texto e filtros de status, tipo, local e prioridade
- Detalhe do chamado em `/chamado/:id`
- Abrir (`/novo`) e editar (`/editar/:id`) com o mesmo formulário; chamados resolvidos não podem ser editados
- Iniciar atendimento (informando o responsável) e resolver (informando a solução), mostrando só a ação do status atual
- Exclusão com confirmação
- Mensagens de carregando, lista vazia e erros vindos da API

## Tecnologias

React, Vite, React Router e Axios (instância única em `src/services/api.js`). Sem bibliotecas de componentes.

## Como rodar

```bash
npm install
cp .env.example .env   # coloque sua chave em VITE_API_KEY
npm run dev
```

O arquivo `.env` não é versionado.
