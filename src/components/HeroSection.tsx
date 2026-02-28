import { Brain, Scan, ArrowRight, Activity, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrainVisual from "@/components/BrainVisual";

interface HeroSectionProps {
  onUploadClick: () => void;
}

const HeroSection = ({ onUploadClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Radial glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                AI-Powered Diagnostics
              </span>
            </div>

            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Detect Brain
                <br />
                Haemorrhage
                <br />
                <span className="gradient-text">Instantly</span>
              </h1>
            </div>

            <p
              className="text-lg text-muted-foreground max-w-lg leading-relaxed opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Upload a CT scan and receive an immediate AI classification of
              haemorrhage type and recommended clinical procedure.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Scan className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-secondary-foreground">
                  5 Haemorrhage Types Identified
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <FileCheck className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-secondary-foreground">
                  Procedure Guidance Included
                </span>
              </div>
            </div>

            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <Button
                onClick={onUploadClick}
                size="lg"
                className="bg-accent text-accent-foreground font-semibold text-base px-8 py-6 rounded-xl btn-glow-cyan"
              >
                Upload CT Scan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right — Brain visual */}
          <div className="hidden lg:block opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <BrainVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
