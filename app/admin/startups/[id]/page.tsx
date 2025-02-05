"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Transition } from "@headlessui/react";

interface Startup {
  _id: string;
  name: string;
  description: string;
  currentBidAmount: number;
  highest_bid: number;
}

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
      return;
    }

    fetch(`/api/startups/${startupId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStartup(data.startup);
        } else {
          setError(data.error || "Failed to fetch startup");
        }
      })
      .catch(() => setError("Error fetching startup"));

    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTeams(data.teams);
        } else {
          setError(data.error || "Failed to fetch teams");
        }
      })
      .catch(() => setError("Error fetching teams"));
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

  const filteredTeams = teams.filter((team) =>
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800 relative">
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

      {error && <p className="text-red-500">{error}</p>}
      {startup ? (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-2">{startup.name}</h1>
          <p className="text-gray-600">{startup.description}</p>
        </div>
      ) : (
        <p>Loading startup details...</p>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Enter Bid Amount:</h3>
        <input
          type="number"
          value={bidAmount ?? ""}
          onChange={(e) => setBidAmount(Number(e.target.value))}
          placeholder="Enter your bid"
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Search Team for Purchase:</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams..."
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
        />
        <div className="space-y-2">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div
                key={team._id}
                className="p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => setSelectedTeam(team)}
              >
                {team.team_name}
              </div>
            ))
          ) : (
            <p>No teams found</p>
          )}
        </div>
      </div>

      {selectedTeam && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            {selectedTeam.team_name} Credits: {selectedTeam.credits}
          </h3>
          <button
            onClick={handlePurchase}
            className="fixed bottom-4 right-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Purchase for ${bidAmount}
          </button>
        </div>
      )}
    </div>
  );
}
