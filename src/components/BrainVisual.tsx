const BrainVisual = () => {
  const haemorrhageTypes = [
    { label: "Epidural", x: "75%", y: "15%", delay: "0s" },
    { label: "Subdural", x: "85%", y: "35%", delay: "0.2s" },
    { label: "Subarachnoid", x: "80%", y: "55%", delay: "0.4s" },
    { label: "Intraparenchymal", x: "70%", y: "72%", delay: "0.6s" },
    { label: "Intraventricular", x: "55%", y: "88%", delay: "0.8s" },
  ];

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Outer glow rings */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/5 animate-pulse-ring" />
      <div className="absolute w-96 h-96 rounded-full bg-primary/3 animate-pulse-ring" style={{ animationDelay: "1s" }} />

      {/* Main brain circle */}
      <div className="relative w-64 h-64 rounded-full glow-purple flex items-center justify-center">
        {/* Gradient background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute inset-2 rounded-full border border-primary/20" />
        <div className="absolute inset-4 rounded-full border border-primary/10" />

        {/* Brain SVG */}
        <svg viewBox="0 0 100 100" className="w-32 h-32 text-primary/80 animate-float" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Left hemisphere */}
          <path d="M50 15 C35 15, 20 25, 18 42 C16 55, 22 65, 30 72 C35 76, 40 82, 45 88 C47 90, 50 90, 50 88" />
          <path d="M50 15 C45 20, 30 22, 25 35 C22 42, 28 48, 32 50" />
          <path d="M25 45 C28 50, 22 58, 28 62 C32 65, 35 60, 38 65" />
          <path d="M32 50 C38 52, 35 58, 40 60 C43 62, 45 58, 48 62" />
          {/* Right hemisphere */}
          <path d="M50 15 C65 15, 80 25, 82 42 C84 55, 78 65, 70 72 C65 76, 60 82, 55 88 C53 90, 50 90, 50 88" />
          <path d="M50 15 C55 20, 70 22, 75 35 C78 42, 72 48, 68 50" />
          <path d="M75 45 C72 50, 78 58, 72 62 C68 65, 65 60, 62 65" />
          <path d="M68 50 C62 52, 65 58, 60 60 C57 62, 55 58, 52 62" />
          {/* Center line */}
          <path d="M50 15 L50 88" strokeDasharray="3 3" strokeWidth="0.8" className="text-primary/40" />
        </svg>
      </div>

      {/* Floating annotation cards */}
      {haemorrhageTypes.map((item) => (
        <div
          key={item.label}
          className="absolute opacity-0 animate-fade-in"
          style={{
            left: item.x,
            top: item.y,
            animationDelay: item.delay,
            animationFillMode: "forwards",
          }}
        >
          <div className="gradient-border rounded-lg px-3 py-2 bg-card/90 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-medium text-foreground whitespace-nowrap">
                {item.label}
              </span>
            </div>
          </div>
          {/* Connecting line */}
          <div
            className="absolute left-0 top-1/2 w-8 h-px bg-gradient-to-l from-accent/50 to-transparent -translate-x-full"
          />
        </div>
      ))}
    </div>
  );
};

export default BrainVisual;
