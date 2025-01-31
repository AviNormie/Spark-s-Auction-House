// AuctionPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Startup {
  _id: string;
  name: string;
  description: string;
}

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/startups")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.startups)) {
          setStartups(data.startups);
        } else {
          setStartups([]);
          console.log("No startups found, setting as empty array");
        }
      })
      .catch((error) => {
        console.error("Error fetching startups:", error);
      });
  }, []);

  const handleRouteChange = (id: string) => {
    router.push(`/admin/startups/${id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Auction Page</h1>
      {startups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <div
              key={startup._id}
              onClick={() => handleRouteChange(startup._id)}
              className="border rounded-2xl p-4 hover:shadow-lg cursor-pointer transition-shadow"
            >
              <h2 className="text-xl font-semibold">{startup.name}</h2>
              <p className="text-gray-600 mt-2">{startup.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No startups available</p>
      )}
    </div>
  );
}
