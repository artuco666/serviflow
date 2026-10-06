[LEIA.MD](https://github.com/user-attachments/files/33108635/LEIA.MD)
# ServiFlow — Como usar

Este pacote contém o sistema completo do ServiFlow:

- `backend/` — a API (FastAPI + PostgreSQL), com autenticação real.
- `frontend/` — a tela que você usa no navegador (React), que se conecta na API.

Os dois precisam estar rodando **ao mesmo tempo** para o sistema funcionar.

---

## 1. O que você precisa ter instalado

- **Docker Desktop** (para rodar o backend + banco de dados sem complicação)
  → https://www.docker.com/products/docker-desktop/
- **Node.js versão 20 ou mais recente** (para rodar o frontend)
  → https://nodejs.org/
- Um terminal (Prompt de Comando, PowerShell, ou Terminal do Mac/Linux)

Depois de instalar, você pode confirmar que deu certo rodando:

```bash
docker --version
node --version
```

---

## 2. Passo 1 — Subir o backend (a API)

Abra um terminal **dentro da pasta `backend/`** e rode:

```bash
cd backend
cp .env.example .env
docker compose up --build
```

Isso vai baixar e configurar o banco de dados e a API automaticamente. Na
primeira vez pode demorar alguns minutos.

Quando aparecer algo como `Uvicorn running on http://0.0.0.0:8000`, a API
está no ar. Para confirmar, abra no navegador:

- http://localhost:8000/health → deve mostrar `{"status":"ok"}`
- http://localhost:8000/docs → documentação interativa da API

**Deixe este terminal aberto** — é ele que mantém o backend rodando.

---

## 3. Passo 2 — Rodar o frontend (a tela)

Abra um **segundo terminal** (deixe o do backend aberto), agora dentro da
pasta `frontend/`:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Quando aparecer `Local: http://localhost:5173`, abra esse endereço no
navegador. É essa tela que você vai usar no dia a dia.

**Deixe este segundo terminal aberto também** enquanto estiver usando o
sistema.

---

## 4. Passo 3 — Primeiro uso

1. Na tela que abriu, clique em **"Cadastre sua empresa"**.
2. Preencha: nome da empresa, seu nome, e-mail e uma senha.
3. Ao enviar, você já entra direto no painel — não precisa logar de novo.
4. Vá em **Clientes** e cadastre um cliente de teste.
5. Vá em **Ordens de serviço**, escolha o cliente, descreva o serviço e o
   valor, e clique em **Criar ordem de serviço**.
6. Na lista, use o menu ao lado do status para mudar de "Novo" para
   "Agendado", "Em Execução" ou "Concluído".
7. Volte para o **Dashboard** — os números (clientes, receita, pipeline)
   já vão refletir o que você cadastrou.

Da próxima vez, é só usar **Entrar** com o e-mail e senha que você criou.

---

## 5. Como parar o sistema

- No terminal do frontend: aperte `Ctrl + C`.
- No terminal do backend: aperte `Ctrl + C` e depois rode `docker compose down`
  (isso desliga o banco de dados também).

Seus dados ficam salvos e continuam lá da próxima vez que você subir tudo de
novo com `docker compose up`.

---

## 6. Problemas comuns

- **"porta já está em uso" / "port is already allocated"**: alguma coisa já
  está usando a porta 8000 ou 5173. Fecha o outro programa ou espera alguns
  segundos e tenta de novo.
- **"docker: command not found"**: o Docker Desktop precisa estar aberto e
  rodando em segundo plano, não só instalado.
- **A tela abre mas não carrega nada / erro de conexão**: confirme que o
  terminal do backend ainda está aberto e sem erros.
- **Esqueci a senha cadastrada**: por enquanto o sistema não tem
  "esqueci minha senha" — é só cadastrar a empresa de novo com outro e-mail
  para testar.

---

## 7. Para quem for mexer no código

Cada pasta tem seu próprio `README.md` com detalhes técnicos (estrutura de
pastas, como rodar sem Docker, endpoints da API, etc.):

- `backend/README.md`
- `frontend/README.md`
