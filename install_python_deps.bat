@echo off
echo 🐍 Installing Python dependencies...
cd pythoncode
pip install fastapi uvicorn opencv-python pillow pytesseract
echo ✅ Python dependencies installed.
pause