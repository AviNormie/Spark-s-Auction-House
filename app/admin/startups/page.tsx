"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Auction Page</h1>
      {startups.length > 0 ? (
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
