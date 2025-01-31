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

const predefinedBidAmounts = [1,2,3,4,5,6,7,8,9,10,11,100, 200, 500, 700, 1000, 1200, 1500, 2000, 2500, 3000, 3500]; // Predefined bid amounts

export default function StartupDetailsPage() {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [bidIndex, setBidIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const params = useParams();

  const currentBidAmount = predefinedBidAmounts[bidIndex];

  // Fetch startup and teams data
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
          setError("Failed to fetch startup");
        }
      })
      .catch(() => setError("Error fetching startup"));

    // Fetch all teams
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTeams(data.teams);
        } else {
          setError("Failed to fetch teams");
        }
      })
      .catch(() => setError("Error fetching teams"));
  }, [params.id]);

  const handleBidClick = () => {
    if (!selectedTeam || !startup) return;

    fetch(`/api/startups/${startup._id}/bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: selectedTeam._id,
        bidAmount: currentBidAmount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds

          setSelectedTeam((prev) =>
            prev ? { ...prev, credits: prev.credits - currentBidAmount } : null
          );
          setStartup((prev) =>
            prev ? { ...prev, currentBidAmount: currentBidAmount } : prev
          );
          setBidIndex((prevIndex) => (prevIndex + 1) % predefinedBidAmounts.length);
        } else {
          alert(data.error || "Failed to place bid");
        }
      })
      .catch(() => alert("Error placing bid"));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800 relative">
      {/* Notification Banner */}
      <Transition
        show={showNotification}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 rounded-lg shadow-md">
          Bid placed successfully!
        </div>
      </Transition>

      {error && <p className="text-red-500">{error}</p>}
      {startup ? (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-2">{startup.name}</h1>
          <p className="text-gray-600">{startup.description}</p>
          <p className="mt-4 text-lg font-semibold">Current Bid: ${startup.currentBidAmount}</p>
        </div>
      ) : (
        <p>Loading startup details...</p>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Team:</h3>
        <select
          onChange={(e) => {
            const selectedId = e.target.value;
            const team = teams.find((t) => t._id === selectedId) || null;
            setSelectedTeam(team);
          }}
          value={selectedTeam?._id || ""}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>
            Select a team
          </option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.team_name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeam && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">
            {selectedTeam.team_name}'s Credits: {selectedTeam.credits}
          </h3>
          <button
            onClick={handleBidClick}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Place Bid ${currentBidAmount}
          </button>
        </div>
      )}
    </div>
  );
}
