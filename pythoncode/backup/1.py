import cv2
import pytesseract
from PIL import Image
import time
import os
from collections import Counter

# Optional if already in PATH
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Number of captures
TOTAL_CAPTURES = 10
CAPTURE_INTERVAL = 1  # seconds

# Start the webcam
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

        if not text:
            display_text = "(No text detected)"
        else:
            display_text = text

        print(f"📷 Frame {i+1} OCR: {display_text}")
        ocr_results.append(display_text)

        # Optional: delete temp file
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
    else:
        print("\n⚠️ No valid text detected in any frame.")

except KeyboardInterrupt:
    print("\n🛑 Stopped by user.")

finally:
    cam.release()
    cv2.destroyAllWindows()
