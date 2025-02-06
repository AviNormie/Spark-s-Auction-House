import Image from "next/image";

export default function About () {
  return (
    <section id="about" className="flex flex-col items-center justify-center text-center bg-black text-white pb-24 px-4">
      {/* Title as an image */}
      <div className="relative w-[500px] h-[100px] mb-6 max-md:w-[350px] mt-12">
        <Image
        className=" "
          src="/about.png"
          alt="What is Startup Auction?"
          layout="fill"
          objectFit="contain"
        />
      </div>

      {/* Description */}
      <p className="max-w-3xl text-lg font-medium text-gray-400">
      Ever wanted to play the role of a high-stakes investor? Here’s your chance! In this thrilling investment showdown, you and your team will analyze real startups, strategize your bids, and compete to build the most valuable portfolio—all within a set budget. Think you have what it takes to spot the next big thing?
<br />
The twist? The real-world market will decide your fate! By 2025, the actual performance of your chosen startups will determine the winners. Will you strike gold or go bust? Time to put your investment instincts to the test! 💰🔥
      </p>
    </section>
  );
};


