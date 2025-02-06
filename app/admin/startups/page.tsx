"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Startup {
  _id: string;
  name: string;
  description: string;
  valuation?: number;
  highestBid?: number;
  ownerTeam?: string;
  currentBidAmount?: number;
  industry?: string;
  problemItSolves?: string;
  businessModel?: string;
  fundingCompanies?: string[];
}

export default function AuctionPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          setError(
            "Brother you are not the admin, so kindly leave this page, or your phone will be hacked."
          );
          setStartups([]);
          return;
        }

        const response = await axios.get("/api/startups", {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });

        if (response.data.success && Array.isArray(response.data.startups)) {
          setStartups(response.data.startups);
        } else {
          setError("No startups found. Please try again.");
          setStartups([]);
        }
      } catch (err) {
        setError("Failed to load startups. Please try again.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRouteChange = (id: string) => {
    router.push(`/admin/startups/${id}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-5xl font-extrabold mb-12 text-center mt-8">
        Spark Startup Auction (Admin Pannel)
      </h1>
      <Input
        className="w-full max-w-md mx-auto mb-8"
        placeholder="Search by company name or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="w-full h-64 flex flex-col">
              <CardHeader className="flex-grow">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-6 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center text-red-500 text-xl">{error}</div>
      )}

      {!loading && !error && !startups.length && (
        <div className="text-center text-xl">No startups available</div>
      )}

      {!loading && !error && startups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
          {filteredStartups.map((startup) => (
            <Card
              key={startup._id}
              className="cursor-pointer hover:shadow-lg transition-shadow h-64 flex flex-col"
              onClick={() => handleRouteChange(startup._id)}
            >
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl mb-2">{startup.name}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {startup.description}
                </p>
              </CardHeader>
              <CardContent>
                {startup.industry && (
                  <Badge className="mb-2">{startup.industry}</Badge>
                )}
                {startup.valuation && (
                  <p className="text-sm">
                    Valuation: ${startup.valuation.toLocaleString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {startup.fundingCompanies &&
                  startup.fundingCompanies.slice(0, 2).map((funding, index) => (
                    <Badge key={index} variant="secondary">
                      {funding}
                    </Badge>
                  ))}
                {startup.fundingCompanies &&
                  startup.fundingCompanies.length > 2 && (
                    <Badge variant="secondary">
                      +{startup.fundingCompanies.length - 2}
                    </Badge>
                  )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
