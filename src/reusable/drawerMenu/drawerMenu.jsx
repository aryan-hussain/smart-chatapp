import React from "react";
import style from "./drawerMenu.module.scss"; // Import CSS for the menu
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DrawerMenu = ({ isOpen, files, removeFile }) => {
  const truncateFilename = (filename, maxLength) => {
    if (filename.length > maxLength) {
      return `${filename.substring(0, maxLength)}...`;
    }
    return filename;
  };
  return (
    <div className={`${style.menu} bg-[#ffffff] ${isOpen ? `${style.open}` : ""}`}>
      <div className="mt-4">
        <h4 className="text-lg font-medium mb-2">Uploaded Files:</h4>
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#334155] rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#94a3b8]" />
                  <span className="text-sm text-[#f1f5f9] truncate">
                    {truncateFilename(file.name, 20)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-[#94a3b8] hover:text-[#f1f5f9]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className=" text-[#94a3b8]">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default DrawerMenu;
