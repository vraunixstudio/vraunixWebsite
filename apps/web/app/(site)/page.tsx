import type { Metadata } from "next";
import { HeroStudio } from "@/components/site/studio/hero-studio";
import { KineticStatement } from "@/components/site/studio/kinetic-statement";
import { ServicesAccordion } from "@/components/site/studio/services-accordion";
import { ProcessStepper } from "@/components/site/studio/process-stepper";
import { LaunchContact } from "@/components/site/studio/launch-contact";

export const metadata: Metadata = {
  title: "First-Class Website Development",
  description:
    "We develop first class websites. Independent website development studio building high-performance digital experiences, custom web applications, and intuitive UI/UX.",
};

export default function HomePage() {
  return (
    <div className="studio-landing">
      <HeroStudio />
      <KineticStatement />
      <ServicesAccordion />
      <ProcessStepper />
      <LaunchContact />
    </div>
  );
}
