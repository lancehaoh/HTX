class Config:
    UPLOAD_FOLDER = 'uploads'
    AI_MODEL = 'openai/whisper-tiny.en'
    SAMPLING_RATE = 16000
    SQLALCHEMY_DATABASE_URI = 'sqlite:///transcriptions.db'
    MAX_FILE_NAME_LENGTH = 100
    ALLOWED_FILE_TYPES = [".mp3", ".wav"]