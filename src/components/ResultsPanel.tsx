import React from "react";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";

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
  surgery_required: boolean;
}

interface ResultsPanelProps {
  imageUrl: string;
  result: AnalysisResult;
}

const severityBadge = (severity: string): React.CSSProperties => {
  const s = severity.toLowerCase();
  if (s.includes("critical"))
    return { background: "#450a0a", color: "#fca5a5", border: "1px solid #dc2626" };
  if (s.includes("high"))
    return { background: "#431407", color: "#fdba74", border: "1px solid #ea580c" };
  if (s.includes("moderate"))
    return { background: "#052e16", color: "#86efac", border: "1px solid #16a34a" };
  return { background: "#1e2d3d", color: "#94a3b8" };
};

const ResultsPanel = ({ imageUrl, result }: ResultsPanelProps) => (
  <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
    {/* Left — Uploaded Scan */}
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Uploaded CT Scan
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
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
        Diagnosis
      </span>

      <p className="mt-3 text-2xl sm:text-3xl font-bold text-foreground leading-tight">
        {result.haemorrhage_type}
      </p>

      <div
        className="mt-3 w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
        style={severityBadge(result.severity)}
      >
        {result.severity}
      </div>

      <div
        className="mt-4 rounded-md px-4 py-2.5 text-sm"
        style={
          result.surgery_required
            ? { background: "#450a0a", borderLeft: "4px solid #dc2626", color: "#fca5a5" }
            : { background: "#052e16", borderLeft: "4px solid #16a34a", color: "#86efac" }
        }
      >
        {result.surgery_required
          ? "⚠ Immediate neurosurgical intervention likely required"
          : "✓ Conservative management appropriate — monitor closely"}
      </div>

      <Separator className="my-5" />

      <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: "1.6" }}>
        {result.description}
      </p>

      {/* Midline Shift — only if detected */}
      {result.midline_shift?.detected && (
        <>
          <Separator className="my-5" />
          <div className="rounded-md px-4 py-3 flex items-start gap-3" style={{ background: "#431407", border: "1px solid #d97706" }}>
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#fcd34d" }} />
            <div className="text-sm text-foreground space-y-0.5">
              <p className="font-medium">
                Midline shift detected
                {result.midline_shift.direction && ` — ${result.midline_shift.direction}`}
              </p>
              {result.midline_shift.estimated_mm != null && (
                <p className="text-muted-foreground">
                  Estimated deviation: {result.midline_shift.estimated_mm} mm
                </p>
              )}
              {result.midline_shift.notes && (
                <p className="text-muted-foreground">{result.midline_shift.notes}</p>
              )}
            </div>
          </div>
        </>
      )}

      <Separator className="my-5" />

      <p className="mb-5 pt-5 text-lg" style={{ borderTop: "1px solid #1e2d3d", color: "#94a3b8", fontWeight: 500 }}>
        Always follow local hospital guidelines and consult neurosurgery.
      </p>

      <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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

      <p className="mt-auto pt-6 text-[11px]" style={{ color: "#475569" }}>
        For clinical decision support only. Always defer to a qualified radiologist.
      </p>
    </div>
  </div>
);

export default ResultsPanel;
