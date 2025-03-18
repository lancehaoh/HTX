from flask import Flask, jsonify, request
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from datasets import load_dataset, Audio
from config import Config
from database import db
import os
from model import Transcription
from flask_cors import CORS
from tempfile import TemporaryDirectory

# initialize the flask app and add the config properties to it
app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

AI_MODEL = app.config['AI_MODEL']
SAMPLING_RATE = app.config['SAMPLING_RATE']

# initialize the app with the db extension
db.init_app(app)

# load AI model and processor
processor = WhisperProcessor.from_pretrained(AI_MODEL)
ai_model = WhisperForConditionalGeneration.from_pretrained(AI_MODEL)

@app.route("/health", methods=["GET"])
def get_health():
    return jsonify({"status": "healthy"}), 200

@app.route("/transcribe", methods=["POST"])
def do_transcription():
    if 'files' not in request.files:
        return jsonify({'error': 'No files part in the request'}), 400

    files = request.files.getlist('files')

    if not files:
        return jsonify({'error': 'No files provided'}), 400
    elif len(files) > Config.MAX_NUMBER_OF_UPLOAD_FILES:
        return jsonify({'error': 'Only 3 files are allowed'}), 400

    # this contains a filename to transcription mapping
    transcription_metadata = []
    errors = []

    with TemporaryDirectory() as temp_dir:
        save_files_to_disk(files, temp_dir)

        # We need to add prefix so that all files will be included in the test split
        # add_prefix_to_files_on_disk(files, "test-", temp_dir)

        # load dataset from local folder and resample each file to 16kHz
        dataset = load_dataset("audiofolder", data_dir=temp_dir)
        dataset = dataset.cast_column("audio", Audio(sampling_rate=SAMPLING_RATE))

        for item in dataset:
            # We remove the appended prefix so that we can get an accurate representation of the filename in the database
            # filename = os.path.basename(item["audio"]["path"])[len("test-"):]
            filename = os.path.basename(item["audio"]["path"])

            if len(filename) > Config.MAX_FILE_NAME_LENGTH:
                errors.append({"filename": filename, "error": "File name is too long" })
                continue

            if "."+filename.split(".")[-1] not in Config.ALLOWED_FILE_TYPES:
                errors.append({"filename": filename, "error": "File type is not supported" })
                continue

            try:
                try:
                    transcription = apply_ai_transcription(item)
                    transcription_metadata.append({"filename": filename, "transcription":transcription[0].strip()})
                except:
                    errors.append({"filename": filename, "error": "Something went wrong" })
            except:
                errors.append({"filename": filename, "error": "Something went wrong" })

    failed_files_at_db = save_transcriptions_to_db(transcription_metadata)

    for failed_file in failed_files_at_db:
        errors.append({"filename": failed_file, "error": "Something went wrong" })

    return jsonify({"transcriptions": transcription_metadata, "errors": errors }), 200

@app.route("/transcriptions", methods=["GET"])
def get_transcriptions():
    transcriptions = db.session.execute(db.select(Transcription.filename, Transcription.transcribed_txt))
    transcription_metadata = []
    for transcription in list(transcriptions):
        transcription_metadata.append({"filename": transcription.filename, "transcription":transcription.transcribed_txt})
    return jsonify(transcription_metadata), 200

@app.route("/search", methods=["GET"])
def search_transcriptions():
    search_pattern = request.args.get("query")

    if not search_pattern:
        return jsonify({'error': 'Please specify the name of the file to search for'}), 400

    transcriptions = db.session.execute(db.select(Transcription.filename, Transcription.transcribed_txt).where(Transcription.filename.ilike(f"%{search_pattern}%")))
    transcription_metadata = []
    for transcription in list(transcriptions):
        transcription_metadata.append({"filename": transcription.filename, "transcription":transcription.transcribed_txt})
    return jsonify(transcription_metadata), 200

def apply_ai_transcription(dataset_item):
    sample = dataset_item["audio"]
    input_features = processor(sample["array"], sampling_rate=sample["sampling_rate"],
                               return_tensors="pt").input_features
    # generate token ids
    predicted_ids = ai_model.generate(input_features)

    # decode token ids to text
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)

    return transcription

def add_prefix_to_files_on_disk(files, prefix, dir):
    for file in files:
        old_filepath = os.path.join(dir, file.filename)
        new_filename = prefix + file.filename
        new_filepath = os.path.join(dir, new_filename)
        os.rename(old_filepath, new_filepath)
        file.filename = new_filename

def save_files_to_disk(files, save_dst):
    saved_files = []
    for file in files:
        filepath = os.path.join(save_dst, file.filename)
        file.save(filepath)
        saved_files.append(file.filename)

    return saved_files

def save_transcriptions_to_db(transcription_metadata):
    failed_files = []
    for transcription_record in transcription_metadata:
        transcription_dao = Transcription(filename=transcription_record["filename"], transcribed_txt=transcription_record["transcription"])
        try:
            db.session.add(transcription_dao)
        except:
            failed_files.append(transcription_record["filename"])

    db.session.commit()
    return failed_files