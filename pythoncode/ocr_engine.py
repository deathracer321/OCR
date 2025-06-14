import cv2
import pytesseract
from PIL import Image
import time
import os
from collections import Counter
import csv

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

TOTAL_CAPTURES = 5
CAPTURE_INTERVAL = 1  # seconds

def run_ocr_with_csv():
    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        return {"error": "Cannot access webcam."}

    ocr_results = []

    try:
        for i in range(TOTAL_CAPTURES):
            ret, frame = cam.read()
            if not ret:
                ocr_results.append("(No text detected)")
                continue

            filename = f"capture_{i}.jpg"
            cv2.imwrite(filename, frame)

            img = Image.open(filename)
            text = pytesseract.image_to_string(img).strip()
            ocr_results.append(text if text else "(No text detected)")

            os.remove(filename)
            time.sleep(CAPTURE_INTERVAL)

    finally:
        cam.release()
        cv2.destroyAllWindows()

    filtered = [t for t in ocr_results if t and t != "(No text detected)"]

    if not filtered:
        return {"error": "No valid text detected in any frame."}

    text_counter = Counter(filtered)
    most_common_text, count = text_counter.most_common(1)[0]
    keyword = most_common_text.strip().split()[0].lower()

    result = {
        "detected_text": most_common_text,
        "appeared_count": count,
        "matched_data": None
    }

    try:
        with open("data.csv", newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['keyword'].strip().lower() == keyword:
                    matched = {k: v for k, v in row.items() if k != 'keyword'}
                    result["matched_data"] = matched
                    break
    except FileNotFoundError:
        result["error"] = "'data.csv' not found."

    return result
