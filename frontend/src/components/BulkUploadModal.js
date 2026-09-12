import React from "react";
import "./BulkUploadModal.css";

const BulkUploadModal = ({
  isOpen,
  onClose,
  onFileChange,
  onUpload,
  file,
  loading = false,
  progress = 0,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bulk-modal-overlay">
      <div className="bulk-modal">

        <div className="bulk-header">
          <div>
            <h2>Bulk Product Upload</h2>
            <p>Upload products using CSV or Excel file.</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="bulk-body">

          <label className="upload-box">
            <div className="upload-icon">📤</div>

            <h3>Drag & Drop CSV / Excel File</h3>

            <p>or Click to Browse</p>

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={onFileChange}
            />
          </label>

          {file && (
            <div className="selected-file">
              <div className="file-icon">📄</div>

              <div>
                <strong>{file.name}</strong>
                <p>{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="progress-section">
              <div className="progress-top">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="bulk-footer">

            <button className="sample-btn">
              Download Sample
            </button>

            <div className="right-buttons">

              <button
                className="cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="upload-btn"
                disabled={!file || loading}
                onClick={onUpload}
              >
                {loading ? "Uploading..." : "Upload Products"}
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BulkUploadModal;