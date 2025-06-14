import React, { useState, useRef ,useEffect} from "react";
import Webcam from "react-webcam";

function App() {
  const [loading, setLoading] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [error, setError] = useState(null);
  const [editText, setEditText] = useState("");
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
      setError("Failed to connect to OCR API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const active = document.activeElement;
      const isInput = active && active.tagName === "INPUT";

      if (isInput) {
        // Enter inside input triggers search
        searchByText();
      } else {
        // Enter outside input triggers scan
        if (!loading) {
          runOcr();
        }
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [editText, loading]); // include dependencies

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
        minHeight: "100vh",
        padding: "0",
        fontFamily: "Arial, sans-serif",
        backgroundImage: "url('/bg-gif.gif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header with logo and title */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px", padding: "30px 30px 0 30px" }}>
        <img
          src="/logo.jpeg"
          alt="OCR Icon"
          style={{ display: "block" }}
        />
        <h1 style={{ margin: 0, color: "#222", letterSpacing: "2px" }}>
          PIECE-ID OCR SCANNER
        </h1>
      </div>
      <p style={{ color: "#555", marginLeft: 30 }}>
        <b>Note:</b> Only uppercase letters and numbers are supported.
      </p>

      {/* Main content: Webcam left, Result right */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "40px",
          marginTop: "30px",
        }}
      >
        {/* Left: Webcam and scan button */}
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!loading) runOcr();
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
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
                marginBottom: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {loading ? "🔄 Scanning..." : "📸 Start OCR Scan"}
            </button>
            {!loading && (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={600}
                height={450}
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                  background: "#fff"
                }}
              />
            )}
          </form>
        </div>

        {/* Right: OCR Result */}
        <div style={{
          minWidth: "350px",
          maxWidth: "500px",
          background: "rgba(255,255,255,0.92)",
          borderRadius: "12px",
          padding: "24px 18px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
        }}>
          {loading && (
            <h2 style={{ color: "#333" }}>
              ⌛ Please hold the part steady... Scanning in progress (~5 seconds)
            </h2>
          )}

          {error && (
            <div style={{ color: "red", marginTop: "20px" }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {ocrData && (
            <div>
              <h3 style={{ color: "#1a237e" }}>✅ OCR Result:</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
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
              <p>
                <strong>Appeared Count:</strong> {ocrData.appeared_count ?? "-"}
              </p>

              {ocrData.matched_data ? (
                <div>
                  <h4 style={{ color: "#388e3c" }}>📄 Matched CSV Data:</h4>
                  <ul style={{ fontSize: "18px", paddingLeft: "18px" }}>
                    {Object.entries(ocrData.matched_data).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}</strong> = {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p style={{ color: "#b71c1c" }}>⚠️ No matching CSV data found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          textAlign: "center",
          padding: "18px 0 10px 0",
          position: "fixed",
          left: 0,
          bottom: 0,
          fontSize: "16px",
          letterSpacing: "1px",
          zIndex: 100,
        }}
      >
        Developed by <b>Poovasanthan</b> &nbsp;|&nbsp; &copy; {new Date().getFullYear()} Skaps Industries
      </footer>
    </div>
  );
}

export default App;