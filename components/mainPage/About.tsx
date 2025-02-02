import Image from "next/image";

export default function About () {
  return (
    <section className="flex flex-col items-center justify-center text-center bg-black text-white pb-24 px-4">
      {/* Title as an image */}
      <div className="relative w-[500px] h-[100px] mb-6">
        <Image
          src="/about.png"
          alt="What is Startup Auction?"
          layout="fill"
          objectFit="contain"
        />
      </div>

      {/* Description */}
      <p className="max-w-3xl text-lg font-medium text-gray-300">
        Startup Auction is a one-of-a-kind event where budding entrepreneurs pitch their groundbreaking ideas, 
        and investors bid to back the next big thing! Whether you're a startup looking for funding or an investor 
        seeking promising ventures, this is your stage.
      </p>
    </section>
  );
};


