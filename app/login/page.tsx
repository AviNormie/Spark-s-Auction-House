"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const loginSchema = z.object({
  enrollmentNumber: z.string().min(5, "Enrollment number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      enrollmentNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await axios.post("/api/teams/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });

      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Login Failed",
          description: error.response?.data?.error || "Invalid credentials",
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Login Failed",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }    
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Team Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="enrollmentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enrollment Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter enrollment number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center text-sm">
                Do not have an account?{" "}
                <Link href="/registration" className="text-primary underline">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
