import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Stack } from "@/components/home/Stack";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Stack />
      <About />
      <Contact />
    </>
  );
}
