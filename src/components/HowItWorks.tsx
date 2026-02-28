import { Upload, Cpu, FileCheck } from "lucide-react";

const steps = [
  {
    num: "1",
    title: "Upload CT Scan",
    desc: "Drag and drop or select a brain CT scan image in PNG or JPG format.",
    icon: Upload,
  },
  {
    num: "2",
    title: "AI Analyses Image",
    desc: "Our model classifies haemorrhage type, severity, and midline shift in seconds.",
    icon: Cpu,
  },
  {
    num: "3",
    title: "Receive Diagnosis",
    desc: "View a detailed report with recommended clinical procedures.",
    icon: FileCheck,
  },
];

const HowItWorks = () => (
  <section className="py-16 bg-muted/50">
    <div className="container mx-auto px-6">
      <h2 className="text-center text-2xl font-semibold text-primary mb-10">
        How It Works
      </h2>
      <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {steps.map((s) => (
          <div
            key={s.num}
            className="bg-card border border-border rounded-lg p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-bold text-muted-foreground mb-1">
              Step {s.num}
            </p>
            <h3 className="text-base font-semibold text-foreground mb-2">
              {s.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
