import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Ocr from '@gutenye/ocr-browser';

function App() {
  const webcamRef = useRef(null);
  const [ocrText, setOcrText] = useState("No text yet");
  const [ocr, setOcr] = useState(null);

  useEffect(() => {
    // Load the OCR model once
    (async () => {
      const instance = await Ocr.create();
      setOcr(instance);
    })();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const captureLoop = async () => {
      if (!ocr || !webcamRef.current) return;

      while (!isCancelled) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          try {
            const result = await ocr.detect(imageSrc);
            const text = result.map(line => line.text).join('\n');
            setOcrText(text || "(no text found)");
          } catch (err) {
            console.error("OCR Error:", err);
            setOcrText("Error reading text");
          }
        }

        // Wait before next capture
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    };

    captureLoop();

    return () => {
      isCancelled = true;
    };
  }, [ocr]);

  return (
    <div style={{ padding: 20 }}>
      <h1>📸 OCR Live Viewer (Every 5 Sec)</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
        height={300}
      />
      <p><strong>Detected Text:</strong></p>
      <pre style={{
        background: '#eee',
        padding: '10px',
        borderRadius: '8px',
        minHeight: '120px',
        whiteSpace: 'pre-wrap'
      }}>
        {ocrText}
      </pre>
    </div>
  );
}

export default App;
