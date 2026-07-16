from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


def _build_engine():
    database_url = settings.SQLALCHEMY_DATABASE_URI
    if database_url.startswith("postgresql"):
        try:
            engine = create_engine(
                database_url,
                pool_pre_ping=True,
                echo=True,
            )
            with engine.connect() as connection:
                connection.execute("SELECT 1")
            return engine
        except Exception as exc:
            sqlite_path = Path(__file__).resolve().parents[2] / "app.db"
            print(f"Postgres unavailable ({exc}); falling back to SQLite at {sqlite_path}")
            return create_engine(f"sqlite:///{sqlite_path}", echo=True)

    return create_engine(database_url, echo=True)


engine = _build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()