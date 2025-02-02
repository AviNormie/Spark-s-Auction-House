import About from "@/components/mainPage/About";
import { Event } from "@/components/mainPage/Event";
import FeatureBox from "@/components/mainPage/FeatureBox";
import { Hero } from "@/components/mainPage/Hero";
import { Navbar } from "@/components/mainPage/Navbar";
import Socials from "@/components/mainPage/Socials";

export default function Home() {
  return (
   <>
    <main className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <Hero />
      <Event />
      <About />
      <FeatureBox />
      <Socials />
    </main>
   </>
  );
}
