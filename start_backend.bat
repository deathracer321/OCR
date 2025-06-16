@echo off
echo ⚙️ Starting Python FastAPI backend...
cd pythoncode
start cmd /k "python -m uvicorn main:app --reload"