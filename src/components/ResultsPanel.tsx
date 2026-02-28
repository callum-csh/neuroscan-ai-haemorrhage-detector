import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export interface AnalysisResult {
  haemorrhage_type: string;
  severity: string;
  description: string;
  procedure: string[];
}

interface ResultsPanelProps {
  imageUrl: string;
  result: AnalysisResult;
  onReset: () => void;
}

const severityColor = (severity: string) => {
  const s = severity.toLowerCase();
  if (s.includes("critical")) return "bg-destructive/20 text-destructive border-destructive/40 glow-red";
  if (s.includes("high")) return "bg-orange-500/20 text-orange-400 border-orange-500/40";
  if (s.includes("moderate")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
  return "bg-destructive/20 text-destructive border-destructive/40 glow-red";
};

const ResultsPanel = ({ imageUrl, result, onReset }: ResultsPanelProps) => {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left — Uploaded Scan */}
            <div
              className="gradient-border rounded-2xl bg-card p-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Uploaded Scan
              </h3>
              <div className="overflow-hidden rounded-xl border border-accent/20 glow-cyan">
                <img
                  src={imageUrl}
                  alt="Uploaded CT scan"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>

            {/* Right — Diagnosis */}
            <div
              className="gradient-border rounded-2xl bg-card p-8 flex flex-col glow-purple opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Diagnosis Result
              </span>

              <p className="mt-4 text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {result.haemorrhage_type}
              </p>

              <div className={`mt-4 w-fit rounded-full border px-4 py-1.5 text-sm font-semibold ${severityColor(result.severity)}`}>
                {result.severity}
              </div>

              <Separator className="my-6 bg-border/50" />

              <p className="leading-relaxed text-secondary-foreground">
                {result.description}
              </p>

              <Separator className="my-6 bg-border/50" />

              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Recommended Procedure
              </h4>

              <div className="space-y-3">
                {result.procedure.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-4 rounded-lg bg-secondary/50 px-4 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-secondary-foreground text-sm">
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-auto pt-8 text-xs text-muted-foreground">
                For clinical decision support only. Always defer to a qualified radiologist.
              </p>
            </div>
          </div>

          <div className="flex justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button
              variant="outline"
              onClick={onReset}
              size="lg"
              className="gradient-border rounded-xl px-8 py-6 text-base font-semibold hover:bg-secondary/50"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Run New Scan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsPanel;
