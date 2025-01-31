"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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

const predefinedBidAmounts = [1000, 5000, 10000, 20000]; // Predefined bid amounts

export default function StartupDetailsPage() {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedBidAmount, setSelectedBidAmount] = useState<number>(predefinedBidAmounts[0]);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

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
        console.log(data);  // Add this to check the response
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

    // Place bid via API
    fetch(`/api/startups/${startup._id}/bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: selectedTeam._id,
        bidAmount: selectedBidAmount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Bid placed successfully");

          // Update the selected team's credits immediately after the bid
          setSelectedTeam((prevTeam) => {
            if (prevTeam) {
              return { ...prevTeam, credits: prevTeam.credits - selectedBidAmount };
            }
            return prevTeam;
          });

          // Optionally, you can also update the startup's current bid amount
          setStartup((prevStartup) => {
            if (prevStartup) {
              return { ...prevStartup, currentBidAmount: selectedBidAmount };
            }
            return prevStartup;
          });
        } else {
          alert(data.error || "Failed to place bid");
        }
      })
      .catch(() => alert("Error placing bid"));
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {startup ? (
        <div>
          <h1>{startup.name}</h1>
          <p>{startup.description}</p>
          <p>Current Bid: ${startup.currentBidAmount}</p>
        </div>
      ) : (
        <p>Loading startup details...</p>
      )}

      <div>
        <h3>Select Team:</h3>
        <select
          onChange={(e) => {
            const selectedId = e.target.value;
            const team = teams.find((t) => t._id === selectedId) || null;
            setSelectedTeam(team);
          }}
          value={selectedTeam?._id || ""}
        >
          <option value="" disabled>Select a team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.team_name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeam && (
        <div>
          <h3>{selectedTeam.team_name}'s Credits: {selectedTeam.credits}</h3>
          <h3>Select Bid Amount:</h3>
          <select onChange={(e) => setSelectedBidAmount(Number(e.target.value))} value={selectedBidAmount}>
            {predefinedBidAmounts.map((amount) => (
              <option key={amount} value={amount}>
                ${amount}
              </option>
            ))}
          </select>
          <button onClick={handleBidClick}>Place Bid</button>
        </div>
      )}
    </div>
  );
}
