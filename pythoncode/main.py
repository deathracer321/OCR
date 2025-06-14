from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from ocr_engine import run_ocr_with_csv
from ocr_engine import run_ocr_with_csv
import csv

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

@app.get("/search-csv")
def search_csv(text: str = Query(..., min_length=1)):
    keyword = text.strip().split()[0].lower()
    try:
        with open("data.csv", newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['keyword'].strip().lower() == keyword:
                    matched = {k: v for k, v in row.items() if k != 'keyword'}
                    return {
                        "detected_text": text,
                        "matched_data": matched
                    }
    except FileNotFoundError:
        return {"error": "'data.csv' not found."}
    return {
        "detected_text": text,
        "matched_data": None
    }