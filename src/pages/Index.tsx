import { useState, useCallback, useRef } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import BrainVisual from "@/components/BrainVisual";
import ResultsPanel, { type AnalysisResult } from "@/components/ResultsPanel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Step = "home" | "analysing" | "results";

const Index = () => {
  const [step, setStep] = useState<Step>("home");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((f: File) => {
    if (f.type === "image/png" || f.type === "image/jpeg") {
      setFile(f);
      setImageUrl(URL.createObjectURL(f));
      setError(null);
    }
  }, []);

  const handleUploadAndAnalyse = useCallback(async () => {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    setStep("analysing");
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
      setStep("results");
    } catch {
      setError("Analysis failed — ensure backend is running.");
      setStep("home");
    }
  }, [file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
    setStep("home");
  }, []);

  // When file selected and we're on home, trigger analysis
  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) {
        handleFileSelect(f);
        // Auto-trigger after selection — store file then analyse
        setFile(f);
        setImageUrl(URL.createObjectURL(f));
      }
    },
    [handleFileSelect]
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg"
        className="hidden"
        onChange={onFileChange}
      />

      {/* STEP 1 — Home */}
      {step === "home" && (
        <main className="flex-1 flex items-center">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  NeuroScan AI
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-foreground">
                  Brain Haemorrhage Classification
                </h1>
                <p className="text-base text-muted-foreground max-w-md">
                  Emergency CT scan analysis powered by AI
                </p>

                {file && (
                  <p className="text-sm text-accent font-medium">
                    Selected: {file.name}
                  </p>
                )}

                <div className="flex items-center gap-4 pt-2">
                  {!file ? (
                    <Button
                      onClick={() => inputRef.current?.click()}
                      size="lg"
                      className="font-medium px-7 py-5 rounded-lg"
                    >
                      Upload CT Scan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUploadAndAnalyse}
                      size="lg"
                      className="font-medium px-7 py-5 rounded-lg"
                    >
                      Analyse Scan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>

                {error && (
                  <div className="rounded-lg px-4 py-3" style={{ background: "#450a0a", border: "1px solid #dc2626" }}>
                    <p className="text-sm font-medium" style={{ color: "#fca5a5" }}>{error}</p>
                  </div>
                )}
              </div>

              <div className="hidden lg:flex justify-center">
                <BrainVisual size={360} speed={0.3} />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* STEP 2 — Analysing */}
      {step === "analysing" && (
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <BrainVisual size={280} speed={1.2} />
            <p className="text-lg font-semibold text-primary">
              Analysing scan…
            </p>
            <Progress value={undefined} className="h-1.5 w-64 [&>div]:animate-pulse [&>div]:bg-primary" />
            <p className="text-xs text-muted-foreground">
              Powered by GPT-4o Vision
            </p>
          </div>
        </main>
      )}

      {/* STEP 3 — Results */}
      {step === "results" && result && imageUrl && (
        <main className="flex-1 py-10">
          <div className="container mx-auto px-6">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                New Scan
              </Button>
            </div>
            <ResultsPanel imageUrl={imageUrl} result={result} />
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;
