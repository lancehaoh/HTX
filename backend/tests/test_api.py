import pytest
import os
from api import app as flask_app  # Import the Flask app instance
from database import db

TEST_DATA_DIR = os.path.join(os.path.dirname(__file__), 'test_data')

@pytest.fixture
def client():
    with flask_app.test_client() as client:
        with flask_app.app_context():
            db.create_all()
        yield client
        with flask_app.app_context():
            db.drop_all()

def test_health_endpoint(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json == {"status": "healthy"}

def test_search_transcriptions(client):
    # Create a test transcription
    with flask_app.app_context():
        from model import Transcription
        test_transcription = Transcription(filename="testfile1", transcribed_txt="test transcription text")
        db.session.add(test_transcription)
        db.session.commit()

    # Send a search request
    response = client.get('/search?query=test')
    assert response.status_code == 200
    assert len(response.json) > 0

    response = client.get('/search?query=invalid')
    assert response.status_code == 200
    assert len(response.json) == 0

def test_do_transcription(client):
    # Prepare files for upload from the test_data directory
    files = [(open(os.path.join(TEST_DATA_DIR, 'Sample_1.mp3'), 'rb'), 'Sample_1.mp3'),
             (open(os.path.join(TEST_DATA_DIR, 'Sample_2.mp3'), 'rb'), 'Sample_2.mp3')]

    # Send a POST request to /transcribe with the files
    response = client.post('/transcribe', data={'files':files}, content_type='multipart/form-data')

    # Assert the response status code and content
    assert response.status_code == 200

    # Get the response data as a dictionary
    response_data = response.json
    # assert len('transcriptions') in response_data
    assert response_data['transcriptions'][0]['transcription'] == 'My name is Ethan. I was asked to come here by 11. Now it is already 3 p.m. They did not even serve me any food or drinks.'
    assert response_data['transcriptions'][1]['transcription'] == "Help me. I can't find my parents. They told me to wait for them, but I saw this pretty butterfly and followed it. Now I am lost."
    assert len(response_data['errors']) == 0

    # Close all the open files
    for (file, filename) in files:
        file.close()