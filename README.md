# Setup Guide

Pre-requisites/Assumptions:
- You are running Windows 10/Windows 11 64-bit.
- Python >= 3.11 (python executable should be available in system path)
- Docker Desktop (docker executable should be available in system path)
- NPM >= 10.7.0 (npm executable should be available in system path)
- Uploaded audio files are at most 30s long.
- Uploaded filenames should be unique (i.e. if you uploaded file_1.mp3 before, you cannot upload file_1.mp3 again).
- At most 3 files can be uploaded at a time.
- Only .mp3/.wav files are supported.

1. Download this repository as a zip file and unzip it.

2. Browse the folder until you see the `frontend` and `backend` folders. Take note the path of your current directory.

3. In Command Prompt, go to the path recorded in the previous step.
```
cd <paste your path here>
```
For example, `cd C:\Users\gabri\Downloads\HTX-main\HTX-main`.

4. Go into the backend folder.
```
cd backend
```

5. Create and activate a new python environment by issuing the following commands:
```
python -m venv myenv
cd myenv\Scripts
activate.bat
```

6. Go back to the backend folder and install all backend dependencies:
```
cd ..\..
pip install -r requirements.txt
```

7. Go to the frontend folder and install frontend dependencies:
```
cd ..\frontend
npm install
```

# Running the app

1. Start docker desktop.

2. Open Command Prompt and go to the downloaded project folder (this is the same path that was recorded
in step 2 of the section **Setup Guide**).
```
cd <paste your path here>
```
For example, `cd C:\Users\gabri\Downloads\HTX-main\HTX-main`.

3. Run the following command to start the app (the command will take a while to complete):
```
docker compose up -d
```

4. Go to http://localhost:3000. You should see the frontend app running.

# Running the unit tests

## Frontend
1. Open Command Prompt and go to the downloaded project folder (this is the same path that was recorded
in step 2 of the section **Setup Guide**).
```
cd <paste your path here>
```
For example, `cd C:\Users\gabri\Downloads\HTX-main\HTX-main`.

2. Go to the frontend folder and run the tests:
```
cd frontend
npm test
```

## Backend unit tests
1. Open Command Prompt and go to the downloaded project folder (this is the same path that was recorded
in step 2 of the section **Setup Guide**).
```
cd <paste your path here>
```
For example, `cd C:\Users\gabri\Downloads\HTX-main\HTX-main`.

2. Go to the backend folder and run the tests:
```
cd backend
pytest
```


