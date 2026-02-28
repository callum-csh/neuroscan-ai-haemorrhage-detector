import { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import UploadZone from "@/components/UploadZone";
import ResultsPanel, { type AnalysisResult } from "@/components/ResultsPanel";
import Footer from "@/components/Footer";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }, []);

  const handleUploadClick = useCallback(() => {
    setTimeout(() => {
      uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
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
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <HeroSection onUploadClick={handleUploadClick} />
        <HowItWorks />

        {/* Upload Section */}
        <section ref={uploadRef} className="py-16 px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-primary">
              Upload Your CT Scan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
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
            <div className="mx-auto mt-5 max-w-2xl">
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-5 py-3 text-center">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            </div>
          )}
        </section>

        {/* Results */}
        {result && imageUrl && (
          <ResultsPanel
            imageUrl={imageUrl}
            result={result}
            onReset={handleReset}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
