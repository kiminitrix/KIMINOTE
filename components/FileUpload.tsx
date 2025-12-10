import React from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  status: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing, status }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-dark-950 p-6 relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-banana-500/10 rounded-full blur-[100px]" />
       <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />

      <div className="text-center mb-12 z-10">
        <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
          KIMI<span className="text-banana-500">NOTE</span>
        </h1>
        <p className="text-xl text-gray-400">Transform documents into stunning presentations instantly.</p>
      </div>

      <div className="w-full max-w-xl z-10">
        {isProcessing ? (
          <div className="bg-dark-900 border border-banana-500/30 rounded-2xl p-12 text-center shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-banana-500/5 animate-pulse" />
             <div className="relative z-10 flex flex-col items-center">
                <Loader2 className="w-16 h-16 text-banana-500 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Analyzing Document</h3>
                <p className="text-gray-400 mb-6">{status}</p>
                <div className="w-64 h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div className="h-full bg-banana-500 animate-[blob_2s_ease-in-out_infinite] w-full origin-left scale-x-50" />
                </div>
             </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-700 rounded-2xl cursor-pointer bg-dark-900/50 hover:bg-dark-900 hover:border-banana-500 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="mb-6 p-4 bg-dark-800 rounded-full group-hover:scale-110 transition-transform">
                 <UploadCloud className="w-10 h-10 text-banana-500" />
              </div>
              <p className="mb-2 text-xl font-semibold text-gray-300 group-hover:text-white">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                PDF, TXT, CSV (Max 10MB)
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.txt,.csv,.json" 
            />
          </label>
        )}
      </div>

      <div className="mt-12 flex gap-4 text-xs text-gray-600 font-mono z-10">
         <span className="flex items-center gap-1"><FileText size={12}/> PDF Parsing</span>
         <span>•</span>
         <span>Gemini AI Engine</span>
         <span>•</span>
         <span>PPTX Export</span>
      </div>
    </div>
  );
};
