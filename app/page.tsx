import { Hero } from "@/components/hero/Hero";
import { EducationScene } from "@/components/scenes/EducationScene";
import { RDSScene } from "@/components/scenes/RDSScene";
import { ResearchExperiments } from "@/components/scenes/ResearchExperiments";
import { MPLSScene } from "@/components/scenes/MPLSScene";
import { FindingsScene } from "@/components/scenes/FindingsScene";
import { IdentityScene } from "@/components/scenes/IdentityScene";
import { ExperienceScene } from "@/components/scenes/ExperienceScene";
import { ContactScene } from "@/components/scenes/ContactScene";
import { SignalThread } from "@/components/scenes/SignalThread";

// Scene colors carry meaning: hoki = signal, waikawa gray = system,
// toast = security finding, limed oak = verified / resolved.
const HOKI = "#6580a4";
const WAIKAWA = "#5f6891";
const TOAST = "#9e7a61";
const LIMED_OAK = "#a78452";

export default function Home() {
  return (
    <>
      <Hero />
      <EducationScene />
      <SignalThread from={HOKI} to={HOKI} label="SIGNAL → RESEARCH" />
      <RDSScene />
      <ResearchExperiments />
      <SignalThread from={HOKI} to={WAIKAWA} label="SIGNAL → NETWORK" />
      <MPLSScene />
      <SignalThread from={WAIKAWA} to={TOAST} label="SIGNAL → FIELD NOTES" />
      <FindingsScene />
      <SignalThread from={TOAST} to={HOKI} label="SIGNAL → IDENTITY" />
      <IdentityScene />
      <ExperienceScene />
      <SignalThread from={WAIKAWA} to={LIMED_OAK} label="SIGNAL → RESOLVING" />
      <ContactScene />
    </>
  );
}
