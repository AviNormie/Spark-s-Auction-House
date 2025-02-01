"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Startup {
  _id: string;
  name: string;
  description: string;
}

export default function AuctionPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchStartups = async () => {
      console.log("Fetching startups from /api/startups...");
      try {
        const response = await axios.get("/api/startups");

        console.log("API Response:", response.data);

        if (response.data.success && Array.isArray(response.data.startups)) {
          setStartups(response.data.startups);
        } else {
          console.warn("No startups found, setting as empty array");
          setStartups([]);
        }
      } catch (err) {
        console.error("Error fetching startups:", err);
        setError("Failed to load startups. Please try again.");
      } finally {
        setLoading(false);
        console.log("Finished fetching startups.");
      }
    };

    fetchStartups();
  }, []);

  const handleRouteChange = (id: string) => {
    console.log("Navigating to startup:", id);
    router.push(`/admin/startups/${id}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Auction Page</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading startups...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : startups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <Card
              key={startup._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleRouteChange(startup._id)}
            >
              <CardHeader>
                <CardTitle>{startup.name}</CardTitle>
                <CardDescription>{startup.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No startups available
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
