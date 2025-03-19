# Description

This is an app that allows users to upload english language audio files to be transcribed and search for transcriptions based on the names of processed files.

# Usage Guide

## Pre-requisites:

### OS Requirements:
- Windows 10/Windows 11 64-bit.

### For running the app:
- Docker Desktop (docker executable must be available in system path)
- Internet Connection (Backend service will download the files for the AI model the first time it is run)

### For running unit tests:
- Python >= 3.8, < 3.12 (python executable must be available in system path)
- pip (pip executable must be available in system path)
- NodeJS >= 20.15.0 / NPM (npm executable must be available in system path)

## Assumptions:
- Uploaded audio files are at most 30 seconds long.
- Uploaded filenames should be unique (i.e. if you uploaded file_1.mp3 before, you cannot upload file_1.mp3 again).
- Names of uploaded files are at most 100 characters long.
- At most 3 files can be uploaded at a time.
- Only .mp3/.wav files are supported.
- Only english language audio is supported.
- The frontend app runs on port 3000 and backend app runs on port 5000. Make sure these ports are free.
- The search feature will perform a pattern search on processed filenames. E.g. Searching for test could yield "test-1.mp3" and "test-2.mp3". 

## Setup

**Important:** Please ensure that you have fulfilled ALL the prerequisites before proceeding with setup.

1. Download this repository as a zip file and unzip it.

2. Browse the unzipped folder until you see the `frontend` and `backend` folders. Take note of the path of your current directory.

**If you just want to run the app, you can now skip to the section "Running the app".** 

3. In Command Prompt, go to the path recorded in the previous step.
```
cd "<paste your path here>"
```
For example, `cd "C:\Users\gabri\Downloads\HTX-main\HTX-main"`.

4. Create and activate a new python environment by issuing the following commands:
```
python -m venv backend\myenv
backend\myenv\Scripts\activate.bat
```

5. Go to the backend folder and install dependencies:
```
cd backend
pip install -r requirements.txt
```

6. Go to the frontend folder and install dependencies:
```
cd ..\frontend
npm install
```

## Running the app

1. Start docker desktop. Wait until the docker engine is started.

2. Open Command Prompt and go to the downloaded project folder (this is the same path that was recorded
in step 2 of the section **Setup**).
```
cd "<paste your path here>"
```
For example, `cd "C:\Users\gabri\Downloads\HTX-main\HTX-main"`.

3. Run the following command to start the app (the command will take a while to complete):
```
docker compose up -d
```

4. Go to http://localhost:3000. You should see the frontend app.

## Running the unit tests

**Important:** Please ensure that you have completed ALL the steps in the section "Setup".

### Frontend
1. Open Command Prompt and go to the downloaded project folder (this is the same path that was recorded
in step 2 of the section **Setup**).
```
cd "<paste your path here>"
```
For example, `cd "C:\Users\gabri\Downloads\HTX-main\HTX-main"`.

2. Go to the frontend folder and run the tests:
```
cd frontend
npm test
```

### Backend
1. Open Command Prompt and go to the downloaded project folder (this is the same path that was recorded
in step 2 of the section **Setup**).
```
cd "<paste your path here>"
```
For example, `cd "C:\Users\gabri\Downloads\HTX-main\HTX-main"`.

2. Go to the backend folder, activate the virtual evnvironment and run the tests:
```
cd backend
myenv\Scripts\activate.bat
pytest
```


