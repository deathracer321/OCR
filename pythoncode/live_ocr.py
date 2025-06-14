import cv2
import pytesseract
from PIL import Image
import time
import os
from collections import Counter
import csv

# Path to Tesseract (optional if already in PATH)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Configuration
TOTAL_CAPTURES = 10
CAPTURE_INTERVAL = 1  # seconds

# Start webcam
cam = cv2.VideoCapture(0)

if not cam.isOpened():
    print("❌ Cannot access webcam.")
    exit()

print("📸 OCR smart capture started. Please hold the text steady for ~10 seconds...\n")

ocr_results = []

try:
    for i in range(TOTAL_CAPTURES):
        ret, frame = cam.read()
        if not ret:
            print(f"⚠️ Frame {i+1} failed.")
            continue

        filename = f"capture_{i}.jpg"
        cv2.imwrite(filename, frame)

        # OCR
        img = Image.open(filename)
        text = pytesseract.image_to_string(img).strip()

        display_text = text if text else "(No text detected)"
        print(f"📷 Frame {i+1} OCR: {display_text}")
        ocr_results.append(display_text)

        os.remove(filename)
        time.sleep(CAPTURE_INTERVAL)

    # Analyze results
    filtered_results = [text for text in ocr_results if text and text != "(No text detected)"]

    if filtered_results:
        text_counter = Counter(filtered_results)
        most_common_text, count = text_counter.most_common(1)[0]

        print("\n✅ Final Result after 10 seconds:")
        print(f"🧾 Most frequent OCR text (appeared {count} times):")
        print(most_common_text)

        # Match keyword from first word of OCR result
        keyword = most_common_text.strip().split()[0].lower()

        found = False
        try:
            with open("data.csv", newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    if row['keyword'].strip().lower() == keyword:
                        print("\n📄 Matched Data from CSV:")
                        for key, value in row.items():
                            if key != 'keyword':
                                print(f"{key} = {value}")
                        found = True
                        break

            if not found:
                print(f"\n⚠️ No match found in data.csv for keyword: {keyword}")

        except FileNotFoundError:
            print("🚫 'data.csv' not found in the current directory.")

    else:
        print("\n⚠️ No valid text detected in any frame.")

except KeyboardInterrupt:
    print("\n🛑 Stopped by user.")

finally:
    cam.release()
    cv2.destroyAllWindows()
