// Use client directive if you're using hooks like useState or useEffect
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for client-side routing

interface Startup {
  _id: string;
  name: string;
  description: string;
}

export default function AuctionPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state
  const router = useRouter();

  useEffect(() => {
    fetch("/api/startups")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.startups)) {
          setStartups(data.startups); // Access startups array inside the response object
        } else {
          setStartups([]); // Handle the case where data.startups is not an array
          console.log("No startups found, setting as empty array");
        }
      })
      .catch((error) => {
        setError("Error fetching startups");
        console.error("Error fetching startups:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleRouteChange = (id: string) => {
    router.push(`/admin/auction/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Display error if any
  }

  return (
    <div>
      <h1>Auction Page</h1>
      {startups.length > 0 ? (
        startups.map((startup) => (
          <div key={startup._id} onClick={() => handleRouteChange(startup._id)}>
            <h2>{startup.name}</h2>
            <p>{startup.description}</p>
          </div>
        ))
      ) : (
        <p>No startups available</p> // Handle the case where there are no startups
      )}
    </div>
  );
}
