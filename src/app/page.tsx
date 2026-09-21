import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { GlobalTexture } from "@/components/global-texture";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Preloader } from "@/components/preloader";
import { Projects } from "@/components/projects";
import { ScrollProgress, SmoothScroll } from "@/components/smooth-scroll";
import { Stack } from "@/components/stack";
import { VelocityMarquee } from "@/components/velocity-marquee";

export default function Home() {
  return (
    <Preloader>
      <SmoothScroll />
      <ScrollProgress />
      <GlobalTexture />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <VelocityMarquee />
        <Stack />
        <Contact />
      </main>
    </Preloader>
  );
}
