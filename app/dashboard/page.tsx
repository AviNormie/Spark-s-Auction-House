"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  LayoutDashboard,
  Search,
  Rocket,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
interface Startup {
  highest_bid: number;
  startup_id: number;
  id: string;
  name: string;
}

interface TeamMember {
  name: string;
  enrollmentNumber: string;
}

interface TeamData {
  _id: string;
  team_id: number;
  team_name: string;
  members: TeamMember[];
  credits: number;
  purchased_startups: Startup[];
  createdAt: string;
  updatedAt: string;
}

const fetchTeamData = async (): Promise<TeamData | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No auth token found.");
      return null;
    }

    const response = await fetch("/api/teams/data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team data. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.team) {
      throw new Error("Invalid team data received");
    }

    return data.team;
  } catch (error) {
    console.error("Error fetching team data:", error);
    return null;
  }
};

function App() {
  const router = useRouter();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchTeamData();
      setTeam(data);
      setLoading(false);
    };
    getData();
  }, []);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/registration");
    }
  });

  const handleAddMember = async () => {
    if (!team) return;

    const memberName = prompt("Enter member name:");
    const enrollmentNumber = prompt("Enter enrollment number:");

    if (!memberName || !enrollmentNumber) {
      alert("Both name and enrollment number are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated.");
        return;
      }

      const response = await fetch("/api/teams/add-member", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: memberName,
          enrollmentNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add member.");
      }

      alert(result.message);
      setTeam(result.team); // Update state with new team data
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <ClipLoader color="#3498db" size={50} />
      </div>
    );
  }

  if (!team) {
    return <div className="text-center p-10 text-red-500">Failed to load team data.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="relative w-full lg:w-64 glass-effect border-b lg:border-r border-white/10">
        <div className="p-4 lg:p-6">
          <div
            onClick={() => {
              router.push("/");
            }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <h1 className="text-lg lg:text-xl font-bold text-white">Spark</h1>
          </div>
        </div>
        <nav className="mt-4 lg:mt-6 px-3 hidden lg:block">
          <a href="#" className="sidebar-link active">
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="glass-effect border-b border-white/10">
          <div className="px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-3 py-2 rounded-lg bg-white/5 w-full lg:w-auto">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search startups..."
                  className="ml-3 bg-transparent border-none focus:outline-none text-sm w-full"
                />
              </div>
              <button
                onClick={() => router.push("/startups")}  
                className="flex items-center px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition w-full lg:w-auto"
              >
                Startups
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">Welcome back, {team.team_name}!</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="stats-card">
              <h3 className="text-base lg:text-lg font-medium">Team Members</h3>
              <p className="text-2xl lg:text-3xl font-bold mb-2">{team.members.length}</p>
            </div>
            <div className="stats-card">
              <h3 className="text-base lg:text-lg font-medium">Credits</h3>
              <p className="text-2xl lg:text-3xl font-bold mb-2">{team.credits}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Member Section */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-lg lg:text-xl font-bold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" /> Team Members
                </h2>
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-blue-500 rounded-lg text-sm font-medium hover:bg-blue-600"
                >
                  <Plus className="h-4 w-4" /> Add Member
                </button>
              </div>
              <table className="team-table min-w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Enrollment Number</th>
                  </tr>
                </thead>
                <tbody>
                  {team.members.map((member) => (
                    <tr key={member.enrollmentNumber}>
                      <td>{member.name}</td>
                      <td>{member.enrollmentNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Purchased Startups Section */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-lg lg:text-xl font-bold flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-blue-400" /> Purchased Startups
              </h2>
              <ul className="mt-4">
                {team.purchased_startups && team.purchased_startups.length > 0 ? (
                  team.purchased_startups.map((startup) => (
                    <li key={startup.id} className="py-2 border-b border-gray-700 flex justify-between items-center">
                      <span className="text-gray-300">Startup ID : {startup.startup_id}</span>
                      <span className="text-right text-gray-300">Highest Bid: {startup.highest_bid}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No purchased startups yet.</li>
                )}
              </ul>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
