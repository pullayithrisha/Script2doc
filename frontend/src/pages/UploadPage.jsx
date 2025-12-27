import { useState, useRef, useCallback } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import "../index.css";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const [download, setDownload] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFiles = Array.from(e.dataTransfer.files);
      const validFiles = selectedFiles.filter(file => 
        file.type.startsWith('image/') || 
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
      );
      
      if (validFiles.length !== selectedFiles.length) {
        alert("Only images (JPG, PNG) and PDF files are allowed!");
      }
      
      setFiles(validFiles.slice(0, 5));
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => 
        file.type.startsWith('image/') || 
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
      );
      
      if (validFiles.length !== selectedFiles.length) {
        alert("Only images (JPG, PNG) and PDF files are allowed!");
      }
      
      setFiles(validFiles.slice(0, 5));
    }
  };

  const upload = async () => {
    if (files.length === 0) {
      alert("Please select files to upload");
      return;
    }

    setLoading(true);
    setText("");
    setDownload("");

    const formData = new FormData();
    for (let f of files) formData.append("files", f);

    try {
      const res = await axios.post("http://localhost:5001/", formData);
      setText(res.data.text);
      setDownload(res.data.download);
    } catch (error) {
      alert("Processing failed. Please try again.");
    }

    setLoading(false);
  };

  const clearFiles = () => {
    setFiles([]);
    setText("");
    setDownload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
  };


  return (
    <>
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Script2Doc</h1>
            <p className="dashboard-subtitle">
              Convert handwritten images & PDFs to editable Word documents
            </p>
          </div>

          <div className="compact-upload-section">
            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''} ${files.length > 0 ? 'has-files' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,image/*"
                onChange={handleFileSelect}
                className="file-input"
                style={{ display: 'none' }}
              />
              
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="upload-text">
                <h3>Drop files or click to browse</h3>
                <p>Images (JPG, PNG) & PDF files only</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="compact-files-preview">
                <div className="files-header">
                  <h4>Selected Files ({files.length})</h4>
                  <button className="clear-btn" onClick={clearFiles}>Clear</button>
                </div>
                <div className="files-list">
                  {files.map((file, index) => (
                    <div key={index} className="compact-file-item">
                      <div className="file-icon">
                        {file.type.startsWith('image/') ? '📷' : '📄'}
                      </div>
                      <div className="file-info">
                        <div className="file-name-row">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="upload-actions">
              <button 
                className="upload-btn primary-btn"
                onClick={upload}
                disabled={files.length === 0 || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Processing...
                  </>
                ) : (
                  'Extract & Convert to Word'
                )}
              </button>
            </div>
          </div>

          {loading && <Loader />}

          {(text || download) && (
            <div className="compact-results-section">
              <div className="results-header">
                <h3>Extracted Text</h3>
                {download && (
                  <a className="download-btn" href={download} download>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download DOC
                  </a>
                )}
              </div>
              
              {text && (
                <div className="text-preview">
                  <div className="text-preview-header">
                    <span>{text.length} characters</span>
                  </div>
                  <pre className="extracted-text">{text}</pre>
                </div>
              )}
            </div>
          )}

          <div className="compact-features">
            <div className="feature-grid">
              <div className="feature-item">
                <div className="feature-icon">📷</div>
                <h4>Images</h4>
                <p>JPG, PNG</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">📄</div>
                <h4>PDF</h4>
                <p>Documents</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">✍️</div>
                <h4>Handwritten</h4>
                <p>Text extraction</p>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">📝</div>
                <h4>Word</h4>
                <p>DOC format</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Footer Section */}
      
    </>
  );
}