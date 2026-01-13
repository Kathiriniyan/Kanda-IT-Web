import {
  Settings2,
  ShieldCheck,
  BarChart3,
  Rocket,
  UserCog,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type ExcellenceItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "orange" | "amber";
};

export const excellenceItems: ExcellenceItem[] = [
  {
    id: "automation",
    label: "Business Automation",
    title: "Smart Automation",
    description:
      "Streamline your repetitive tasks with custom automated workflows designed to save your business time and reduce manual errors.",
    icon: Settings2,
    accent: "orange",
  },
  {
    id: "quality",
    label: "Quality Standards",
    title: "Elite Code Quality",
    description:
      "High-performance, clean code architecture for all your digital products right when you need it.",
    icon: ShieldCheck,
    accent: "amber",
  },
  {
    id: "erp",
    label: "Strategic ERP Solutions",
    title: "Integrated ERP",
    description:
      "Centralize your entire business operation with custom-built ERP systems that unify your data, finances, and resource management.",
    icon: BarChart3,
    accent: "orange",
  },
  {
    id: "speed",
    label: "Delivery Speed",
    title: "Rapid Deployment",
    description:
      "Faster, smoother development cycles than traditional agencies, ensuring your product hits the market early.",
    icon: Rocket,
    accent: "orange",
  },
  {
    id: "team",
    label: "Team Structure",
    title: "Dedicated Lead Experts",
    description:
      "Work with a senior project lead and specialized developers who understand your business vision.",
    icon: UserCog,
    accent: "amber",
  },
  {
    id: "scale",
    label: "Scaling",
    title: "Scalable Architecture",
    description:
      "Built for businesses at every stage, with flexible infrastructure designed to grow alongside your user base.",
    icon: TrendingUp,
    accent: "orange",
  },
];
