"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Startup {
  name: string;
  description: string;
}

export default function StartupDetailsPage() {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams(); // Correct way to access dynamic route params

  useEffect(() => {
    if (!params.id) {
      setError("Invalid startup ID");
      setLoading(false);
      return;
    }

    fetch(`/api/startups/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStartup(data.startup);
        } else {
          setError("Failed to fetch startup");
        }
      })
      .catch(() => setError("Error fetching startup"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{startup?.name}</h1>
      <p>{startup?.description}</p>
    </div>
  );
}
