import { FaBolt, FaGavel, FaNetworkWired, FaGift } from "react-icons/fa";

const features = [
  {
    icon: <FaBolt size={28} />,
    title: "Pitch Your Idea",
    description: "Showcase your startup, grab attention.",
  },
  {
    icon: <FaGavel size={28} />,
    title: "Bid on Startups",
    description: "Compete to invest in the most promising ventures ",
  },
  {
    icon: <FaNetworkWired size={28} />,
    title: "Connect & Collaborate",
    description: "Expand your connections and grow together.",
  },
  {
    icon: <FaGift size={28} />,
    title: "Claim Your Rewards",
    description: "Win exclusive perks and bragging rights as the ultimate investor!",
  },
];

export default function FeatureBox() {
  return (
    <section className="relative flex justify-center items-center py-20 px-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-2xl shadow-lg opacity-60"
        style={{ backgroundImage: "url('/event-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-5 rounded-2xl"></div>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 w-full max-w-7xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-900 bg-opacity-40 text-white p-10 rounded-2xl shadow-2xl text-cente backdrop-blur-lg min-h-[250px] flex flex-col justify-center items-center"
          >
            <div className="text-2xl mb-4 flex justify-center items-center gap-3 font-semibold">
              {feature.icon} {feature.title}
            </div>
            <p className="text-gray-300 text-lg">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
