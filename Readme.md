# 📸 PIECE-ID OCR SCANNER

An end-to-end smart OCR solution with:

- Python backend (FastAPI)
- React.js frontend (Webcam interface)
- Tesseract OCR engine
- CSV data matching

Designed to **capture text using a webcam**, extract the **most frequent result** after 10 captures, and **display matched data from a CSV file**.

---

## 🧰 Prerequisites

Before running the app, install the following software:

### ✅ Required Software

| Tool         | Install Link                                                                 | Version Check Command   |
|--------------|------------------------------------------------------------------------------|------------------------|
| **Node.js**  | [Download](https://nodejs.org/)                                              | `node -v`              |
| **Python 3** | [Download](https://www.python.org/downloads/)                                | `python --version`     |
| **Tesseract**| [Download (UB Mannheim)](https://github.com/UB-Mannheim/tesseract/wiki)      | `tesseract -v`         |

### ✅ Setup Notes

- **Python**: During installation, check `Add Python to PATH`.
- **Tesseract**: Install to `C:\Program Files\Tesseract-OCR\tesseract.exe` and add that folder to your system's PATH (Environment Variables).

---

## 📁 Folder Structure

```
/poovasanthan
├── /pythoncode
│   └── main.py           # FastAPI OCR backend
├── /react/webcam-ocr
│   └── package.json      # React frontend
├── data.csv              # Lookup file for OCR result
├── setup.bat             # One-click runner (first-time install + launch)
└── README.md             # This file
```

---

## 🔧 One-Time Setup (First Run)

Double-click the `setup.bat` file in the `poovasanthan` root folder. This will:

1. Install Python dependencies (via `pip`)  
2. Start the backend server (`uvicorn main:app --reload`)  
3. Install React frontend dependencies (`npm install`)  
4. Start the frontend (`npm start`)

> 🟢 **After the first run**, everything is installed — you only need to run the backend and frontend separately or reuse the batch file to restart them.

---

## 🚀 How to Run (Everyday Use)

### Option 1: With `setup.bat`

- Double-click `setup.bat` from the root folder.
- It will automatically launch both backend and frontend.

### Option 2: Manual Run (Advanced)

#### 1️⃣ Start the Backend (OCR API)

```bash
cd pythoncode
uvicorn main:app --reload
```

#### 2️⃣ Start the Frontend (React App)

```bash
cd react/webcam-ocr
npm start
```

---

## 🛠️ API Endpoints

| Endpoint                  | Description                                 |
|---------------------------|---------------------------------------------|
| `GET /run-ocr`            | Captures 10 frames and returns result       |
| `GET /search-csv?text=XYZ`| Looks up text in data.csv                   |

---

## 📄 CSV Format Example (`data.csv`)

```csv
keyword,A,B,C
ABC123,20,40,60
XYZ789,12,34,56
```

---

## 📝 App Usage Flow

1. Start the app.
2. Click "📸 Start OCR Scan".
3. Webcam captures 10 frames over 10 seconds.
4. Most frequent text is extracted.
5. If the text's first word matches any keyword in `data.csv`, details are displayed.
6. You can also manually search by editing the result and clicking "🔍 Search".

---