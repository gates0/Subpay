from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from config import settings

DATABASE_URL = settings.DATABASE_URL

# if DATABASE_URL.startswith("postgres://"):
#     DATABASE_URL = DATABASE_URL.replace(
#         "postgres://",
#         "postgresql+psycopg2://",
#         1
#     )
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass