import React, { useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [error, setError] = useState(null);

  const runOcr = async () => {
    setLoading(true);
    setOcrData(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/run-ocr");
      const data = await response.json();

      if (response.ok) {
        setOcrData(data);
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

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1>🧠 Live OCR Scanner (via Python API)</h1>
      <button
        onClick={runOcr}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {loading ? "🔄 Scanning..." : "📸 Start OCR Scan"}
      </button>

      <div style={{ marginTop: "30px" }}>
        {loading && <p>⌛ Please hold the text steady... Scanning in progress (~10 seconds)</p>}

        {error && (
          <div style={{ color: "red", marginTop: "20px" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {ocrData && (
          <div style={{ marginTop: "20px", background: "#f4f4f4", padding: "15px", borderRadius: "8px" }}>
            <h3>✅ OCR Result:</h3>
            <p><strong>Detected Text:</strong> {ocrData.detected_text}</p>
            <p><strong>Appeared Count:</strong> {ocrData.appeared_count}</p>

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
