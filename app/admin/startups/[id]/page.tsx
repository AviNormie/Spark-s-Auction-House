"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { Search } from "lucide-react";

interface Startup {
  _id: string;
  name: string;
  description: string;
  currentBidAmount: number;
  highest_bid: number;
  bid_session: boolean;
  funding_companies?: string[];
}
// interface Startup {
//   _id: string;
//   name: string;
//   description: string;
//   valuation?: number;
//   highestBid?: number;
//   ownerTeam?: string;
//   currentBidAmount?: number;
//   industry?: string;
//   problemItSolves?: string;
//   businessModel?: string;
//   fundingCompanies?: string[];
// }

interface Team {
  _id: string;
  team_name: string;
  credits: number;
}

export default function StartupDetailsPage() {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();

  useEffect(() => {
    const startupId = params.id;
    if (!startupId) {
      setError("Invalid startup ID");
      console.error(error);
      return;
    }

    fetch(`/api/startups/${startupId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStartup(data.startup);
        } else {
          setError(data.error || "Failed to fetch startup");
          console.error(data.error || "Failed to fetch startup");
        }
      })
      .catch((err) => {
        setError("Error fetching startup");
        console.error("Error fetching startup:", err);
      });

    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTeams(data.teams);
        } else {
          setError(data.error || "Failed to fetch teams");
          console.error(data.error || "Failed to fetch teams");
        }
      })
      .catch((err) => {
        setError("Error fetching teams");
        console.error("Error fetching teams:", err);
      });
  }, [params.id]);

  const handlePurchase = () => {
    if (!selectedTeam || !startup) {
      alert("Please select a team.");
      return;
    }
    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    fetch(`/api/startups/${startup._id}/bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: selectedTeam._id,
        bidAmount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);

          setSelectedTeam((prev) =>
            prev ? { ...prev, credits: prev.credits - bidAmount } : null
          );
        } else {
          alert(data.error || "Failed to complete purchase");
        }
      })
      .catch(() => alert("Error completing purchase"));
  };

  const handleStartBidSession = () => {
    if (!startup) return;
    fetch(`/api/startups/${startup._id}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Bid session started successfully!");
          setStartup((prev) => (prev ? { ...prev, bid_session: true } : null));
        } else {
          alert(data.error || "Failed to start bid session");
        }
      })
      .catch(() => alert("Error starting bid session"));
  };

  const filteredTeams = teams.filter((team) =>
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Transition
        show={showNotification}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 rounded-lg shadow-md">
          Bid placed successfully!
        </div>
      </Transition>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="p-1 rounded-3xl mb-8">
            <div className="bg-black p-12 rounded-3xl">
              <Image
                src="/hero-text.png"
                alt="Spark's Auction House"
                width={600}
                height={150}
                className="mx-auto mb-8"
              />
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mb-12">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full max-w-2xl px-6 py-4 text-black rounded-l-full text-lg"
            />
            <button className="px-8 py-4 bg-gradient-to-b from-red-600 to-blue-600 rounded-r-full">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div
          className="w-full max-w-full overflow-hidden mx-auto rounded-3xl"
          style={{
            backgroundImage: "url('/event-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 p-8">
            <div className="flex-grow space-y-8">
              <div className="bg-gradient-to-r from-red-600 to-blue-600 p-[1px] rounded-2xl">
                <div className="bg-[#111] bg-opacity-95 p-6 rounded-2xl">
                  {startup ? (
                    <>
                      <h1 className="text-3xl font-bold mb-6">
                        Startup Number: {startup._id}
                      </h1>
                      <div className="grid md:grid-cols-2 gap-8 mb-6">
                        <div>
                          <h2 className="text-xl font-semibold mb-4">
                            Startup Details
                          </h2>
                          <p className="text-gray-300">{startup.description}</p>
                          <p className="text-gray-300">
                            {startup.funding_companies?.join(", ")}
                          </p>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold mb-4">
                            Bid Details
                          </h2>
                          <p className="text-gray-300">
                            Current Bid: ${startup.currentBidAmount}
                            <br />
                            Highest Bid: ${startup.highest_bid}
                            <br />
                            Status:{" "}
                            {startup.bid_session ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                      {!startup.bid_session && (
                        <button
                          onClick={handleStartBidSession}
                          className="mt-4 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                          Start Bid Session
                        </button>
                      )}
                    </>
                  ) : (
                    <p>Loading startup details...</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-600 to-blue-600 p-[1px] rounded-2xl">
                <div className="bg-[#111] bg-opacity-95 p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-2">
                    Enter Bid Amount:
                  </h3>
                  <input
                    type="number"
                    value={bidAmount ?? ""}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    placeholder="Enter your bid"
                    className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 text-black"
                  />
                  {selectedTeam && (
                    <div className="text-center">
                      <button
                        onClick={handlePurchase}
                        className="px-12 py-3 bg-gradient-to-b from-red-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        PURCHASE ${bidAmount}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-96">
              <div className="bg-gradient-to-r from-red-600 to-blue-600 p-[1px] rounded-2xl">
                <div className="bg-[#111] bg-opacity-95 p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-4">Teams</h2>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredTeams.map((team) => (
                      <div
                        key={team._id}
                        className="p-4 bg-black bg-opacity-70 rounded-lg cursor-pointer hover:bg-opacity-90 transition-colors"
                        onClick={() => setSelectedTeam(team)}
                      >
                        <h3 className="font-semibold">{team.team_name}</h3>
                        {/* <p className="text-gray-400">Credits: {team.credits}</p> */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
