# ServiFlow API — Milestone 1 (Backend estruturado + PostgreSQL + Auth real)

Este é o backend reescrito do ServiFlow, substituindo o protótipo Flask + SQLite
original por uma API estruturada, pronta para evoluir para os próximos milestones
(multi-tenancy, billing, WhatsApp, PWA do técnico, IA).

## O que mudou em relação ao MVP

| MVP original (Flask) | Agora (Milestone 1) |
|---|---|
| SQLite | PostgreSQL |
| Um único `app.py` | Backend estruturado em módulos (models, schemas, routers, security) |
| Sem autenticação | Autenticação real com JWT (registro de empresa + login) |
| Sem separação por empresa | Toda entidade tem `company_id` — base para multi-tenancy (Milestone 2) |
| HTML server-side | API JSON (REST), documentação automática em `/docs` |
| Sem migrations | Alembic (migrations versionadas do schema) |

## Stack

- **FastAPI** (Python) — API
- **PostgreSQL** — banco de dados
- **SQLAlchemy 2.0** — ORM
- **Alembic** — migrations
- **JWT (python-jose) + bcrypt** — autenticação

## Estrutura

```
app/
  config.py       # configurações via variáveis de ambiente
  database.py     # engine/session do SQLAlchemy
  models.py       # Company, User, Client, Job (ORM)
  schemas.py      # schemas Pydantic (request/response)
  security.py     # hash de senha e JWT
  deps.py         # dependências do FastAPI (DB session, usuário autenticado)
  main.py         # criação da app e inclusão das rotas
  routers/
    auth.py       # registro de empresa + login
    clients.py    # CRUD de clientes
    jobs.py       # CRUD de ordens de serviço (OS)
    dashboard.py  # métricas (clientes, OS abertas, receita, pipeline)
alembic/          # migrations
```

## Modelo de dados

- **Company**: cada empresa que assina o ServiFlow (tenant).
- **User**: usuário vinculado a uma `Company`, com papel (`owner`, `admin`,
  `technician`). Autentica com e-mail/senha.
- **Client**: cliente da empresa (vinculado a `company_id`).
- **Job**: ordem de serviço (OS), vinculada a `company_id` e `client_id`, com
  status (`Novo`, `Agendado`, `Em Execução`, `Concluído`, `Cancelado`).

Todas as consultas de clientes/OS são filtradas por `company_id` do usuário
autenticado — isso já garante que uma empresa não vê dados de outra nas rotas
da API. O isolamento *rígido* de tenant (ex.: Row-Level Security no Postgres)
fica para o Milestone 2, junto com convite de múltiplos usuários por empresa.

## Rodando localmente com Docker (recomendado)

```bash
cp .env.example .env
# edite o .env e troque SECRET_KEY por um valor aleatório
docker compose up --build
```

A API sobe em `http://localhost:8000`. As migrations rodam automaticamente
antes do servidor subir.

## Rodando sem Docker

```bash
pip install -r requirements.txt

# Suba um Postgres local e ajuste a DATABASE_URL, por exemplo:
export DATABASE_URL="postgresql+psycopg2://usuario:senha@localhost:5432/serviflow"
export SECRET_KEY="troque-por-uma-chave-aleatoria"

alembic upgrade head
uvicorn app.main:app --reload
```

## Documentação interativa

Com o servidor rodando, acesse:

- `http://localhost:8000/docs` (Swagger UI)
- `http://localhost:8000/redoc`

## Fluxo básico da API

```bash
# 1. Registrar empresa + usuário owner
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Climatiza VV","owner_name":"Arthur","email":"arthur@empresa.com","password":"senha123"}'
# -> retorna { "access_token": "...", "token_type": "bearer" }

# 2. Usar o token nas próximas chamadas
TOKEN="<access_token retornado acima>"

# 3. Criar cliente
curl -X POST http://localhost:8000/clients \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"João da Silva","phone":"27999990000","address":"Vila Velha - ES"}'

# 4. Criar ordem de serviço (OS)
curl -X POST http://localhost:8000/jobs \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"client_id":1,"title":"Instalação de 2 aparelhos","value":1280}'

# 5. Atualizar status da OS
curl -X PATCH http://localhost:8000/jobs/1/status \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"Concluído"}'

# 6. Ver o dashboard
curl http://localhost:8000/dashboard/summary -H "Authorization: Bearer $TOKEN"
```

Esse fluxo foi testado de ponta a ponta (registro → login → cliente → OS →
mudança de status → dashboard) durante o desenvolvimento.

## O que fica para os próximos milestones

Conforme o roadmap do plano (`ServiFlow_Plano_Completo.md`):

- **Milestone 2 — Multi-tenancy**: convite de múltiplos usuários por empresa,
  papéis mais granulares (ex.: técnico só vê suas próprias OS), isolamento
  reforçado de dados entre empresas.
- **Milestone 3 — Billing**: integração com gateway de pagamento (parceiro),
  planos (Start/Pro/Scale/Enterprise), cobrança recorrente.
- **Milestone 4 — WhatsApp**: canal de atendimento e captura de leads.
- **Milestone 5 — PWA do técnico**: app simplificado para celular (chegada,
  fotos, assinatura, peças, pagamento).
- **Milestone 6/7 — IA e Analytics**.

Este backend já está estruturado (routers, schemas, models separados) para
que essas features entrem como novos routers/módulos sem precisar reescrever
o que já existe.

## Frontend

Este milestone é focado em backend. O frontend React/TypeScript/Tailwind
sugerido no plano ainda não foi iniciado — a API já está pronta para ser
consumida por ele (CORS liberado em desenvolvimento). O `dashboard.html` do
MVP antigo fica como referência visual, mas não está mais conectado a este
backend.
