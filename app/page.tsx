import About from "@/components/mainPage/About";
import { Event } from "@/components/mainPage/Event";
import FeatureBox from "@/components/mainPage/FeatureBox";
import { Hero } from "@/components/mainPage/Hero";
import { Navbar } from "@/components/mainPage/Navbar";
import Socials from "@/components/mainPage/Socials";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black flex flex-col overflow-hidden">
      {/* Moving dots background */}
      <div className="absolute inset-0 bg-dots pointer-events-none"></div>

      <Navbar />
      <Hero />
      <Event />
      <About />
      <FeatureBox />
      <Socials />
    </main>
  );
}
