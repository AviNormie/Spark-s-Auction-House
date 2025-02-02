"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Hero() {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center h-[33rem] relative">
      {/* Hero Image */}
      <Image
        ref={imageRef}
        src="/hero-text.png"
        alt="Spark's Auction House"
        width={500}
        height={150}
        priority
        className="mb-4 px-4 pt-16 sm:w-[300px] sm:h-auto lg:w-[60rem] lg:h-auto absolute top-[14.5rem] pointer-events-none transform -translate-y-12"
      />
      
      {/* Hero Text */}
      <div className="absolute top-[20rem]  transform -translate-y-12 lg:translate-y-0 mt-16">
        <p
          ref={textRef}
          className="text-lg mt-4 px-4 sm:text-2xl font-extralight lg:text-3xl  text-gray-300"
        >
          Where Innovation Meets Investment
        </p>
      </div>
    </div>
  );
}
