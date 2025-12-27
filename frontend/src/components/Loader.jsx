import { useState, useEffect } from "react";

export default function Loader() {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Processing your files...",
    "Extracting handwritten text...",
    "Converting to Word document...",
    "Almost done, hold on..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-spinner">
          <div className="spinner-ring"></div>
        </div>
        <p className="loader-text">{messages[messageIndex]}</p>
        <p className="loader-subtext">This may take a moment</p>
      </div>
    </div>
  );
}