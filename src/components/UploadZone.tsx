import { useCallback, useRef, useState } from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onAnalyse: () => void;
  isLoading: boolean;
}

const UploadZone = ({ onFileSelect, selectedFile, onAnalyse, isLoading }: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type === "image/png" || file.type === "image/jpeg") {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : selectedFile
            ? "border-accent bg-accent/5"
            : "border-border hover:border-primary/50 bg-card"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <ScanLine className="h-8 w-8 text-muted-foreground mb-3" />
        {selectedFile ? (
          <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">
              Drop CT scan here or click to upload
            </p>
            <p className="mt-1 text-xs text-muted-foreground">PNG and JPG accepted</p>
          </>
        )}
      </div>

      {isLoading && (
        <Progress value={undefined} className="h-1.5 w-full [&>div]:animate-pulse" />
      )}

      <div className="flex justify-center">
        <Button
          onClick={onAnalyse}
          disabled={!selectedFile || isLoading}
          size="lg"
          className="bg-primary text-primary-foreground font-medium px-8 py-5 rounded-lg"
        >
          {isLoading ? "Analysing…" : "Analyse Scan"}
        </Button>
      </div>
    </div>
  );
};

export default UploadZone;
