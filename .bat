@echo off
REM Change to React project directory and install dependencies
cd react\webcam-ocr
echo Running npm install...
npm install

echo Starting npm start...
start cmd /k "npm start"

REM Change to Python project directory and install dependencies
cd ..\..\pythoncode
echo Running pip install -r requirements.txt...
pip install -r requirements.txt

echo Starting uvicorn server...
start cmd /k "uvicorn main:app --reload"

REM Return to root folder
cd ..
echo All processes started.
pause