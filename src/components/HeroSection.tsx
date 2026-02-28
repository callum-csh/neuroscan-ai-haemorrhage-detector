import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrainVisual from "@/components/BrainVisual";

interface HeroSectionProps {
  onUploadClick: () => void;
}

const HeroSection = ({ onUploadClick }: HeroSectionProps) => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-primary">
              Rapid Brain Haemorrhage Classification
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Upload a CT scan for instant AI-assisted diagnosis, haemorrhage
              classification, and clinical procedure guidance.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <Button
                onClick={onUploadClick}
                size="lg"
                className="bg-primary text-primary-foreground font-medium px-7 py-5 rounded-lg"
              >
                Upload CT Scan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <button
                onClick={onUploadClick}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Learn more <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <BrainVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
