import os

class Config:
    UPLOAD_FOLDER = 'uploads'
    AI_MODEL = 'openai/whisper-tiny.en'
    SAMPLING_RATE = 16000
    SQLALCHEMY_DATABASE_URI = 'sqlite:///transcriptions.db'
    MAX_FILE_NAME_LENGTH = 100
    MAX_NUMBER_OF_UPLOAD_FILES = 3
    ALLOWED_FILE_TYPES = [".mp3", ".wav"]

    if os.environ.get('PYTEST_VERSION'):
        SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Use an in-memory SQLite database for testing