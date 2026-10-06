from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações da aplicação, lidas de variáveis de ambiente (.env)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Banco de dados
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/serviflow"

    # Autenticação
    secret_key: str = "CHANGE_ME_IN_PRODUCTION"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24h

    # Geral
    environment: str = "development"


settings = Settings()
