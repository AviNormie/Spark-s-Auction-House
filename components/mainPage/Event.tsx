"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { gsap } from "gsap";

export function Event() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2025-02-10T18:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".fade-in",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-black p-4 md:p-0">
    {/* Background Image */}
    <div className="relative mx-4 md:mx-12 p-4 md:p-8 overflow-hidden rounded-xl md:rounded-[0.7rem]">
      <div className="absolute inset-0">
        <Image
          src="/event-bg.png"
          alt="Event Background"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
        />
      </div>
  
      {/* Content Wrapper */}
      <div className="relative w-full md:w-[100%] max-w-[1600px] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 text-white p-4 md:p-8">
        {/* Left Section (Hero + Timer) */}
        <div className="w-full flex flex-col gap-6 md:gap-10 items-center md:items-center pr-0 md:pr-12">
          {/* Hero Section with Background Image */}
          <div
            className="relative h-[25rem] opacity-35 bg-cover bg-center p-8 md:p-16 rounded-3xl fade-in shadow-lg w-full"
            style={{ backgroundImage: "url('/event-bg-1.jpeg')" }}
          >
            <h1 className="text-xl md:text-4xl font-bold text-gray-200 mr-2">
              Spark’s Auction House: <br /> Where Innovation Meets Investment
            </h1>
            <button className="mt-4 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition w-full md:w-auto">
              Register Now
            </button>
          </div>
  
          {/* Countdown Timer */}
          <div className="fade-in text-center text-3xl md:text-5xl font-bold mt-4">
            <h2 className="text-xl md:text-2xl font-semibold">Time Left</h2>
            <div className="flex justify-center gap-4 md:gap-6 mt-2">
              <div>{timeLeft.days}d</div> : <div>{timeLeft.hours}h</div> : <div>{timeLeft.minutes}m</div> : <div>{timeLeft.seconds}s</div>
            </div>
          </div>
        </div>
  
        {/* Right Section (Logos + Details) */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-10 items-center md:items-start pl-0 md:pl-12">
          {/* Logos Box (Spark & Hatchery) */}
          <div className="flex justify-between gap-8 fade-in w-full max-w-[600px]">
            <div className="flex justify-center w-auto max-w-[180px]">
              <Image
                src="/spark-logo.png"
                alt="Spark"
                width={240}
                height={240}
                className="w-full h-auto"
              />
            </div>
            <div className="flex justify-center w-auto max-w-[240px]">
              <Image
                src="/hatchery-logo.png"
                alt="Bennett Hatchery"
                width={240}
                height={200}
                className="w-full h-auto"
              />
            </div>
          </div>
  
          {/* Event Details */}
          <div className="p-10 md:p-14 rounded-2xl fade-in w-full max-w-[1100px]">
            <h2 className="text-3xl md:text-4xl font-semibold">Details</h2>
            <p className="mt-4 text-xl md:text-2xl">
              📅 Date: <span className="text-gray-300">7th Feb</span>
            </p>
            <p className="mt-4 text-xl md:text-2xl">
              📍 Venue: <span className="text-gray-300">A-block Hatchery</span>
            </p>
            <p className="mt-4 text-xl md:text-2xl">
              ⏰ Time: <span className="text-gray-300">6:00 pm</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}