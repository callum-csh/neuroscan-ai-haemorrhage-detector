import { useCallback, useRef, useState } from "react";
import { Brain, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="mx-auto w-full max-w-2xl space-y-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl p-14 transition-all duration-300 overflow-hidden ${
          isDragging
            ? "glow-cyan"
            : selectedFile
            ? ""
            : ""
        }`}
        style={{
          border: "1px solid transparent",
          background: isDragging
            ? "linear-gradient(hsl(240 6% 8%), hsl(240 6% 8%)) padding-box, linear-gradient(135deg, hsl(187 94% 43% / 0.6), hsl(271 81% 56% / 0.4)) border-box"
            : selectedFile
            ? "linear-gradient(hsl(240 6% 8%), hsl(240 6% 8%)) padding-box, linear-gradient(135deg, hsl(271 81% 56% / 0.5), hsl(187 94% 43% / 0.3)) border-box"
            : "linear-gradient(hsl(240 6% 8%), hsl(240 6% 8%)) padding-box, linear-gradient(135deg, hsl(240 6% 15%), hsl(240 6% 20%)) border-box",
        }}
      >
        {/* Dashed inner border */}
        <div className={`absolute inset-2 rounded-lg border-2 border-dashed transition-colors duration-300 ${
          isDragging ? "border-accent/60" : selectedFile ? "border-primary/40" : "border-border group-hover:border-primary/30"
        }`} />

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
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/15">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          {selectedFile ? (
            <p className="text-lg font-medium text-foreground">{selectedFile.name}</p>
          ) : (
            <>
              <p className="text-lg font-medium text-foreground">
                Drop CT Scan here or click to upload
              </p>
              <p className="mt-2 text-sm text-muted-foreground">PNG and JPG accepted</p>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onAnalyse}
          disabled={!selectedFile || isLoading}
          size="lg"
          className="bg-accent text-accent-foreground font-semibold text-base px-10 py-6 rounded-xl btn-glow-cyan"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin-slow" />
              Analysing…
            </span>
          ) : (
            "Analyse Scan"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UploadZone;
