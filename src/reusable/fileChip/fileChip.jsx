import React from "react";
import "./fileChip.scss";

const FileChip = ({ files }) => {
  const fileCount = files.length;

  if (fileCount === 0) {
    return <div className="file-chip no-files">No files uploaded yet</div>;
  }

  return (
    <div className="file-chip-container ">
      {files.slice(0, 1).map((file, index) => (
        <div key={index} className="file-chip">
          {file.name}
        </div>
      ))}
      {fileCount > 1 && (
        <div className="file-chip more-files">+{fileCount - 1} more files</div>
      )}
    </div>
  );
};

export default FileChip;
