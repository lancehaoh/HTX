import datetime

from config import Config
from database import db
from sqlalchemy import Integer, String, TIMESTAMP, func

from sqlalchemy.orm import Mapped, mapped_column

class Transcription(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    filename: Mapped[str] = mapped_column(String(Config.MAX_FILE_NAME_LENGTH), nullable=False, unique=True)
    transcribed_txt: Mapped[str] = mapped_column(String(1000000), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP, server_default=func.now())