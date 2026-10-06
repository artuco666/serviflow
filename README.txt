SERVIFLOW - COMO USAR
======================

Este pacote contem o sistema completo do ServiFlow:

  - backend/   -> a API (FastAPI + PostgreSQL), com autenticacao real.
  - frontend/  -> a tela que voce usa no navegador (React), que se conecta
                  na API.

Os dois precisam estar rodando AO MESMO TEMPO para o sistema funcionar.


1. O QUE VOCE PRECISA TER INSTALADO
------------------------------------

  - Docker Desktop (para rodar o backend + banco de dados sem complicacao)
      https://www.docker.com/products/docker-desktop/

  - Node.js versao 20 ou mais recente (para rodar o frontend)
      https://nodejs.org/

  - Um terminal (Prompt de Comando, PowerShell, ou Terminal do Mac/Linux)

Depois de instalar, confirme que deu certo rodando estes comandos no
terminal:

  docker --version
  node --version


2. PASSO 1 - SUBIR O BACKEND (A API)
--------------------------------------

Abra um terminal DENTRO da pasta "backend" e rode, um comando de cada vez:

  cd backend
  cp .env.example .env
  docker compose up --build

Isso vai baixar e configurar o banco de dados e a API automaticamente. Na
primeira vez pode demorar alguns minutos.

Quando aparecer uma linha parecida com:
  "Uvicorn running on http://0.0.0.0:8000"
a API esta no ar. Para confirmar, abra no navegador:

  http://localhost:8000/health   -> deve mostrar {"status":"ok"}
  http://localhost:8000/docs     -> documentacao interativa da API

DEIXE ESSE TERMINAL ABERTO - e ele que mantem o backend rodando.


3. PASSO 2 - RODAR O FRONTEND (A TELA)
-----------------------------------------

Abra um SEGUNDO terminal (deixe o do backend aberto), agora dentro da pasta
"frontend":

  cd frontend
  npm install
  cp .env.example .env
  npm run dev

Quando aparecer "Local: http://localhost:5173", abra esse endereco no
navegador. E essa tela que voce vai usar no dia a dia.

DEIXE ESSE SEGUNDO TERMINAL ABERTO TAMBEM enquanto estiver usando o sistema.


4. PASSO 3 - PRIMEIRO USO
----------------------------

  1. Na tela que abriu, clique em "Cadastre sua empresa".
  2. Preencha: nome da empresa, seu nome, e-mail e uma senha.
  3. Ao enviar, voce ja entra direto no painel - nao precisa logar de novo.
  4. Va em "Clientes" e cadastre um cliente de teste.
  5. Va em "Ordens de servico", escolha o cliente, descreva o servico e o
     valor, e clique em "Criar ordem de servico".
  6. Na lista, use o menu ao lado do status para mudar de "Novo" para
     "Agendado", "Em Execucao" ou "Concluido".
  7. Volte para o "Dashboard" - os numeros (clientes, receita, pipeline) ja
     vao refletir o que voce cadastrou.

Da proxima vez, e so usar "Entrar" com o e-mail e senha que voce criou.


5. COMO PARAR O SISTEMA
--------------------------

  - No terminal do frontend: aperte Ctrl + C.
  - No terminal do backend: aperte Ctrl + C e depois rode:
      docker compose down
    (isso desliga o banco de dados tambem).

Seus dados ficam salvos e continuam la da proxima vez que voce subir tudo
de novo com "docker compose up".


6. PROBLEMAS COMUNS
----------------------

  - "porta ja esta em uso" / "port is already allocated":
      alguma coisa ja esta usando a porta 8000 ou 5173. Feche o outro
      programa ou espere alguns segundos e tente de novo.

  - "docker: command not found":
      o Docker Desktop precisa estar ABERTO e rodando em segundo plano,
      nao so instalado.

  - A tela abre mas nao carrega nada / erro de conexao:
      confirme que o terminal do backend ainda esta aberto e sem erros.

  - Esqueci a senha cadastrada:
      por enquanto o sistema nao tem "esqueci minha senha" - cadastre a
      empresa de novo com outro e-mail para testar.


7. PARA QUEM FOR MEXER NO CODIGO
-----------------------------------

Cada pasta tem seu proprio README.md com detalhes tecnicos (estrutura de
pastas, como rodar sem Docker, endpoints da API, etc.):

  - backend/README.md
  - frontend/README.md
