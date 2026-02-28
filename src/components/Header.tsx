import { Brain } from "lucide-react";

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-xl">
    <div className="container mx-auto flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow-purple">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Neuro<span className="gradient-text">Scan</span> AI
        </h1>
      </div>
      <p className="hidden text-sm font-medium text-muted-foreground sm:block tracking-wide">
        Rapid Haemorrhage Classification
      </p>
    </div>
  </header>
);

export default Header;
