import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  fileInputKey?: number; // Optional key to force re-render of the component
}

export function FileUpload({ onFileUpload, fileInputKey }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/javascript': ['.js', '.jsx', '.ts', '.tsx'],
      'text/x-python': ['.py'],
      'text/x-java': ['.java']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
      key={fileInputKey} // Add key prop to force re-render when fileInputKey changes
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Drop the file here..."
          : "Drag 'n' drop a file here, or click to select"}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Supported files: .js, .jsx, .ts, .tsx, .py, .java
      </p>
    </div>
  );
}