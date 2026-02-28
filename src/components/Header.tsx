import { Brain } from "lucide-react";

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-sm">
    <div className="container mx-auto flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold tracking-tight text-primary">
          NeuroScan AI
        </span>
      </div>
      <p className="hidden text-xs text-muted-foreground sm:block">
        AI-Powered Radiology Assistant
      </p>
    </div>
  </header>
);

export default Header;
