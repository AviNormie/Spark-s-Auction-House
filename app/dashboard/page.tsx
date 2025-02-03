"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Member {
  name: string;
  enrollmentNumber: string;
}

interface TeamData {
  team_id: number;
  team_name: string;
  members: Member[];
  credits: number;
  purchased_startups: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TeamDashboard() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await axios.get<{ team: TeamData }>("/api/teams/data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTeamData(response.data.team);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.error || "Failed to fetch team data.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Skeleton className="w-96 h-32 mb-4" />
        <Skeleton className="w-80 h-20" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Team Info */}
      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">Team Name: {teamData?.team_name ?? "N/A"}</p>
          <p className="text-gray-500">Team ID: {teamData?.team_id ?? "N/A"}</p>
          <p className="text-gray-500">
            Created At: {teamData?.createdAt ? new Date(teamData.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {teamData?.members.map((member, index) => (
              <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-md">
                <span className="font-medium">{member.name}</span>
                <Badge>{member.enrollmentNumber}</Badge>
              </li>
            )) ?? <p className="text-gray-500">No members found.</p>}
          </ul>
        </CardContent>
      </Card>

      {/* Credits */}
      <Card>
        <CardHeader>
          <CardTitle>Team Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{teamData?.credits ?? 0} Credits</p>
        </CardContent>
      </Card>

      {/* Purchased Startups */}
      <Card>
        <CardHeader>
          <CardTitle>Purchased Startups</CardTitle>
        </CardHeader>
        <CardContent>
          {teamData?.purchased_startups.length ? (
            <ul className="list-disc pl-5">
              {teamData.purchased_startups.map((startup, index) => (
                <li key={index} className="text-gray-700">{startup}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No startups purchased yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
