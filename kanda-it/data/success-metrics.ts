import {
  Rocket,
  Zap,
  Database,
  TrendingUp,
  Code2,
  Clock
} from "lucide-react";

export interface SuccessMetric {
  title: string;
  description: string;
  icon: React.ElementType;
}

export const successMetrics: SuccessMetric[] = [
  {
    title: "99.9% Uptime",
    description:
      "We deploy robust architectures for web and app projects, ensuring your digital presence remains live and reliable for users around the clock.",
    icon: Rocket,
  },
  {
    title: "3x Faster Workflows",
    description:
      "Our custom automation and ERP solutions eliminate manual bottlenecks, enabling teams to execute business operations three times faster.",
    icon: Zap,
  },
  {
    title: "Zero Data Loss",
    description:
      "With secure database management and strict data handling protocols, your company’s information stays protected and always accessible.",
    icon: Database,
  },
  {
    title: "ROI in First Quarter",
    description:
      "By streamlining operations with integrated business solutions, most clients see ROI within the first three months.",
    icon: TrendingUp,
  },
  {
    title: "100% Custom Built",
    description:
      "We never use generic templates. Every solution is fully custom-engineered to match your exact business requirements.",
    icon: Code2,
  },
  {
    title: "24hr Technical Kickoff",
    description:
      "Our team initiates technical discovery and project planning within 24 hours of your first consultation.",
    icon: Clock,
  },
];
