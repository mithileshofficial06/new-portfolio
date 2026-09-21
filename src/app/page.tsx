import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Credentials } from "@/components/credentials";
import { GlobalTexture } from "@/components/global-texture";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Preloader } from "@/components/preloader";
import { Projects } from "@/components/projects";
import { ScrollProgress, SmoothScroll } from "@/components/smooth-scroll";
import { Stack } from "@/components/stack";
import { Traveler } from "@/components/traveler";
import { VelocityMarquee } from "@/components/velocity-marquee";
import { Why } from "@/components/why";

export default function Home() {
  return (
    <Preloader>
      <SmoothScroll />
      <ScrollProgress />
      <GlobalTexture />
      <Nav />
      <main className="relative">
        <Traveler />
        <Hero />
        <Projects />
        <About />
        <VelocityMarquee />
        <Stack />
        <Credentials />
        <Why />
        <Contact />
      </main>
    </Preloader>
  );
}
