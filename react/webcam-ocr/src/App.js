import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

function App() {
  const [loading, setLoading] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [error, setError] = useState(null);
  const [editText, setEditText] = useState(""); // For editable text
  const webcamRef = useRef(null);

  const runOcr = async () => {
    setLoading(true);
    setOcrData(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/run-ocr");
      const data = await response.json();

      if (response.ok) {
        setOcrData(data);
        setEditText(data.detected_text || "");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Failed to connect to OCR API.");
    } finally {
      setLoading(false);
    }
  };

  // New: Search by edited text
  const searchByText = async () => {
    setLoading(true);
    setError(null);
    setOcrData(null);
    try {
      const response = await fetch(
        `http://localhost:8000/search-csv?text=${encodeURIComponent(editText)}`
      );
      const data = await response.json();
      if (response.ok) {
        setOcrData(data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to search API.");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div
    style={{
      padding: "30px",
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      backgroundImage: "url('/bg-gif.gif')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >

    <img
      src="/logo.jpeg"
      alt="OCR Icon"
      style={{ display: "block" }}
      width={80}
      height={80}
    />
  <br />
    <h1 style={{textAlign: "center"}}>PIECE-ID OCR SCANNER</h1>
<form
  onSubmit={e => {
    e.preventDefault();
    if (!loading) runOcr();
  }}
  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
>
  <button
    type="submit"
    disabled={loading}
    style={{
      padding: "10px 20px",
      fontSize: "16px",
      cursor: loading ? "not-allowed" : "pointer",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      marginBottom: "16px"
    }}
  >
    {loading ? "🔄 Scanning..." : "📸 Start OCR Scan"}
  </button>

  {!loading && (
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      width={640}
      height={480}
    />
  )}
</form>

      <div style={{ marginTop: "30px" }}>
        {loading && (
          <h1>
            ⌛ Please hold the part steady... Scanning in progress (~5 seconds)
          </h1>
        )}

        {error && (
          <div style={{ color: "red", marginTop: "20px" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {ocrData && (
          <div
            style={{
              marginTop: "20px",
              background: "#f4f4f4",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>✅ OCR Result:</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{
                  fontSize: "16px",
                  padding: "5px 10px",
                  width: "60%",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={searchByText}
                disabled={loading || !editText.trim()}
                style={{
                  padding: "6px 16px",
                  fontSize: "15px",
                  backgroundColor: "#2196F3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                🔍 Search
              </button>
            </div>

            {ocrData.matched_data ? (
              <div>
                <h4>📄 Matched CSV Data:</h4>
                <ul>
                  {Object.entries(ocrData.matched_data).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}</strong> = {value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>⚠️ No matching CSV data found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;