from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ocr_engine import run_ocr_with_csv

app = FastAPI()

# Optional: allow React frontend to access this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set frontend origin here for production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/run-ocr")
def ocr_endpoint():
    result = run_ocr_with_csv()
    return result
