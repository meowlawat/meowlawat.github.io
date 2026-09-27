import { Hero } from "@/components/hero/Hero";
import { RDSScene } from "@/components/scenes/RDSScene";
import { ResearchExperiments } from "@/components/scenes/ResearchExperiments";
import { MPLSScene } from "@/components/scenes/MPLSScene";
import { FindingsScene } from "@/components/scenes/FindingsScene";
import { IdentityScene } from "@/components/scenes/IdentityScene";
import { ExperienceScene } from "@/components/scenes/ExperienceScene";
import { ContactScene } from "@/components/scenes/ContactScene";
import { SignalThread } from "@/components/scenes/SignalThread";

// Scene colors carry meaning: cobalt = signal, teal = system,
// rust = security finding, sage = verified / resolved.
const COBALT = "#7187b3";
const TEAL = "#668b88";
const RUST = "#b47767";
const SAGE = "#9eaa7b";

export default function Home() {
  return (
    <>
      <Hero />
      <SignalThread from={COBALT} to={COBALT} label="SIGNAL → RESEARCH" />
      <RDSScene />
      <ResearchExperiments />
      <SignalThread from={COBALT} to={TEAL} label="SIGNAL → NETWORK" />
      <MPLSScene />
      <SignalThread from={TEAL} to={RUST} label="SIGNAL → FIELD NOTES" />
      <FindingsScene />
      <SignalThread from={RUST} to={COBALT} label="SIGNAL → IDENTITY" />
      <IdentityScene />
      <ExperienceScene />
      <SignalThread from={TEAL} to={SAGE} label="SIGNAL → RESOLVING" />
      <ContactScene />
    </>
  );
}
