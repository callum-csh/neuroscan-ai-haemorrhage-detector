import { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UploadZone from "@/components/UploadZone";
import ResultsPanel, { type AnalysisResult } from "@/components/ResultsPanel";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }, []);

  const handleUploadClick = useCallback(() => {
    setShowUpload(true);
    setTimeout(() => {
      uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  const handleAnalyse = useCallback(async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/analyse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Request failed");

      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch {
      setError("Analysis failed — ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
    setShowUpload(false);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {!result ? (
        <>
          <HeroSection onUploadClick={handleUploadClick} />

          {showUpload && (
            <section ref={uploadRef} className="relative py-20 px-4">
              {/* Background glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
              </div>

              <div className="relative z-10">
                <div className="text-center mb-10 opacity-0 animate-fade-in-up">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    Upload Your <span className="gradient-text">CT Scan</span>
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Drag and drop or click to select your brain CT scan image
                  </p>
                </div>

                <UploadZone
                  onFileSelect={handleFileSelect}
                  selectedFile={file}
                  onAnalyse={handleAnalyse}
                  isLoading={isLoading}
                />

                {error && (
                  <div className="mx-auto mt-6 max-w-2xl">
                    <div className="gradient-border rounded-xl bg-destructive/10 px-6 py-4 text-center">
                      <p className="text-sm font-medium text-destructive animate-fade-in">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          {/* Spacer for fixed header */}
          <div className="h-20" />
          {imageUrl && (
            <ResultsPanel
              imageUrl={imageUrl}
              result={result}
              onReset={handleReset}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
