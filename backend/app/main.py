from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, clients, jobs, dashboard

app = FastAPI(
    title="ServiFlow API",
    description="API do ServiFlow — o sistema operacional das empresas de serviços.",
    version="0.2.0",
)

# CORS liberado para desenvolvimento; restringir origens em produção.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(jobs.router)
app.include_router(dashboard.router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
