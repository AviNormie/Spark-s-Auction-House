"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        router.push("/admin/startups"); // Redirect to dashboard
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white relative">
      {/* Dotted background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1) 1px,transparent 1px)] bg-[size:10px_10px]"></div>

      {/* Login Card */}
      <Card className="w-[350px] bg-gray-900 border border-gray-700 shadow-lg relative z-10 text-white">
        <CardHeader>
          <CardTitle className="text-xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-600"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
