# ServiFlow — Frontend

Frontend do ServiFlow em React + TypeScript + Tailwind CSS (v4), consumindo a
API do Milestone 1 (`serviflow-backend-milestone1.zip`).

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** (via plugin do Vite, sem `tailwind.config.js`)
- **React Router** para navegação
- Sem bibliotecas de estado externas — `Context` para autenticação, `fetch`
  direto para a API.

## Rodando localmente

```bash
npm install
cp .env.example .env
# ajuste VITE_API_URL se o backend não estiver em localhost:8000
npm run dev
```

A aplicação sobe em `http://localhost:5173`. É necessário que o backend
(Milestone 1) esteja rodando — veja o README do backend para subi-lo com
`docker compose up`.

## Build de produção

```bash
npm run build   # gera a pasta dist/
npm run preview # serve o build localmente para conferir
```

## Estrutura

```
src/
  lib/
    api.ts        # cliente HTTP tipado para a API (fetch + JWT)
    types.ts       # tipos espelhando os schemas do backend
    format.ts       # formatação de moeda (BRL) e data
  context/
    AuthContext.tsx # sessão do usuário (token em localStorage)
  components/
    Sidebar.tsx, AppShell.tsx, ProtectedRoute.tsx
    AuthLayout.tsx, StatCard.tsx, StatusTag.tsx
  pages/
    LoginPage.tsx, RegisterPage.tsx
    DashboardPage.tsx, ClientsPage.tsx, JobsPage.tsx
```

## Telas

- **Entrar / Cadastrar empresa** — login e registro (cria empresa + usuário
  owner de uma vez, como no backend).
- **Dashboard** — cards de clientes, OS em aberto, receita e pipeline, mais a
  lista das OS mais recentes.
- **Clientes** — lista de clientes + formulário de cadastro sempre visível ao
  lado (sem modal).
- **Ordens de serviço** — lista filtrável por status, com troca de status
  inline (dropdown por linha) e formulário de criação ao lado.

## Direção visual

Paleta e tipografia pensadas para o universo de climatização/refrigeração —
teal (linha de refrigeração) como cor de ação, cobre (tubulação) como
destaque secundário, números em monoespaçada como um "painel de instrumento".
Layout denso e alinhado à esquerda: é uma ferramenta de trabalho usada horas
por dia, não uma landing page. Sem cards arredondados genéricos nem badges em
pílula — tags de status com borda lateral colorida, painéis com hairline.

## O que falta para produção

- Tratamento de expiração/renovação de token (hoje, token expirado só é
  detectado no próximo request e desloga o usuário).
- Paginação nas listas de clientes/OS (hoje carrega tudo de uma vez).
- Estados de erro mais ricos (ex.: distinguir "sem conexão com a API" de
  "credenciais inválidas").
- Testes automatizados (não incluídos neste milestone).
