import { Event } from "@/components/mainPage/Event";
import { Hero } from "@/components/mainPage/Hero";
import { Navbar } from "@/components/mainPage/Navbar";

export default function Home() {
  return (
   <>
    <main className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <Hero />
      <Event />
    </main>
   </>
  );
}
