import { Container } from "@/components/ui/Container";
import { education } from "@/data/education";

const iitPatna = education.find((e) => e.institution === "IIT Patna");
const vips = education.find((e) => e.institution === "VIPS");

export function About() {
  return (
    <section id="about" className="border-t border-border py-20 sm:py-28">
      <Container>
        <p className="font-mono text-xs tracking-[0.14em] text-muted-2 uppercase">About</p>
        <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-foreground/90 sm:text-xl">
          <p>
            I&rsquo;m Hardik — a cybersecurity researcher and systems builder working across
            trusted computing, network security and applied machine learning.
          </p>
          <p>
            {iitPatna ? (
              <>
                I&rsquo;m dual-enrolled in a {iitPatna.degree} in {iitPatna.field} at{" "}
                {iitPatna.institution}
              </>
            ) : null}
            {vips ? (
              <>
                {" "}
                and a {vips.degree} in {vips.field} at {vips.institution}
              </>
            ) : null}
            . Most of my time goes into building systems, testing their assumptions, and
            turning the interesting failures into research.
          </p>
        </div>
      </Container>
    </section>
  );
}
