import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";

export interface MidlineShift {
  detected: boolean;
  direction?: string;
  estimated_mm?: number;
  notes?: string;
}

export interface AnalysisResult {
  haemorrhage_type: string;
  severity: string;
  description: string;
  procedure: string[];
  midline_shift?: MidlineShift;
}

interface ResultsPanelProps {
  imageUrl: string;
  result: AnalysisResult;
  onReset: () => void;
}

const severityStyle = (severity: string) => {
  const s = severity.toLowerCase();
  if (s.includes("critical"))
    return "bg-destructive/10 text-destructive border-destructive/30";
  if (s.includes("high"))
    return "bg-[hsl(38_92%_50%/0.1)] text-[hsl(38_92%_40%)] border-[hsl(38_92%_50%/0.3)]";
  if (s.includes("moderate"))
    return "bg-[hsl(142_72%_37%/0.1)] text-[hsl(142_72%_30%)] border-[hsl(142_72%_37%/0.3)]";
  return "bg-muted text-muted-foreground border-border";
};

const ResultsPanel = ({ imageUrl, result, onReset }: ResultsPanelProps) => {
  return (
    <section className="w-full py-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left — Uploaded Scan */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Uploaded Scan
              </h3>
              <div className="overflow-hidden rounded-md border border-border">
                <img
                  src={imageUrl}
                  alt="Uploaded CT scan"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>

            {/* Right — Diagnosis */}
            <div className="rounded-lg border border-border bg-card p-6 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Diagnosis
              </span>

              <p className="mt-3 text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {result.haemorrhage_type}
              </p>

              <div
                className={`mt-3 w-fit rounded-full border px-3 py-1 text-xs font-semibold ${severityStyle(result.severity)}`}
              >
                {result.severity}
              </div>

              <Separator className="my-5" />

              <p className="leading-relaxed text-muted-foreground text-sm">
                {result.description}
              </p>

              {/* Midline Shift */}
              {result.midline_shift && (
                <>
                  <Separator className="my-5" />
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Midline Shift Analysis
                  </h4>
                  {result.midline_shift.detected ? (
                    <div className="rounded-md border border-[hsl(38_92%_50%/0.3)] bg-[hsl(38_92%_50%/0.06)] px-4 py-3 flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-[hsl(38_92%_40%)] mt-0.5 shrink-0" />
                      <div className="text-sm text-foreground space-y-1">
                        <p className="font-medium">Midline shift detected</p>
                        {result.midline_shift.estimated_mm != null && (
                          <p className="text-muted-foreground">
                            Estimated deviation: {result.midline_shift.estimated_mm} mm
                            {result.midline_shift.direction && ` (${result.midline_shift.direction})`}
                          </p>
                        )}
                        {result.midline_shift.notes && (
                          <p className="text-muted-foreground">{result.midline_shift.notes}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No significant midline shift detected.
                    </p>
                  )}
                </>
              )}

              <Separator className="my-5" />

              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recommended Procedure
              </h4>

              <div className="space-y-2">
                {result.procedure.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-md bg-muted/60 px-4 py-2.5"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold bg-primary text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-sm text-foreground">
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-auto pt-6 text-xs text-muted-foreground">
                For clinical decision support only. Always defer to a qualified
                radiologist.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={onReset}
              size="lg"
              className="rounded-lg px-6 py-5 text-sm font-medium"
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
