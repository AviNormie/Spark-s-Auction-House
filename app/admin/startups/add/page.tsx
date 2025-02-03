"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StartupSchema } from "@/lib/validations/startup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type StartupFormValues = z.infer<typeof StartupSchema>;

export default function StartupForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<StartupFormValues>({
    resolver: zodResolver(StartupSchema),
    defaultValues: {
      name: "",
      description: "",
      valuation: undefined,
      industry: "",
      problem_it_solves: "",
      businessModel: "",
      funding_companies: [],
    },
  });

  useEffect(() => {
    Object.entries(errors).forEach(([key, error]) => {
      if (error?.message) {
        console.warn(`Validation Error in ${key}:`, error.message);
      }
    });
  }, [errors]);

  const onSubmit = async (data: StartupFormValues) => {
    // console.log("Form submitted with data:", data);
    setLoading(true);

    try {
      const formattedData = {
        ...data,
        funding_companies: Array.isArray(data.funding_companies)
          ? data.funding_companies
          : (data.funding_companies ?? "").split(",").map((c) => c.trim()),
      };

    //   console.log("Sending data to API:", formattedData);

      const response = await axios.post("/api/startups", formattedData);
    //   console.log("API Response:", response.data);

      toast.success("Startup added successfully!");
      reset();
    } catch (err: unknown) {
      console.error("Request Error:", err);
      if (axios.isAxiosError(err)) {
        const errorResponse = err.response?.data;
        console.error("API Error Response:", errorResponse);
        toast.error(errorResponse?.error || "Failed to add startup.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-6">
      <CardHeader>
        <CardTitle>Add a Startup</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            console.log("Form submit button clicked");
            handleSubmit(onSubmit)(event);
          }}
          className="space-y-4"
        >
          {/* Name Field */}
          <div>
            <Label>Name</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Description Field */}
          <div>
            <Label>Description</Label>
            <Input {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          {/* Industry Field */}
          <div>
            <Label>Industry</Label>
            <Input {...register("industry")} />
            {errors.industry && <p className="text-red-500 text-sm">{errors.industry.message}</p>}
          </div>

          {/* Problem It Solves Field */}
          <div>
            <Label>Problem It Solves</Label>
            <Input {...register("problem_it_solves")} />
            {errors.problem_it_solves && (
              <p className="text-red-500 text-sm">{errors.problem_it_solves.message}</p>
            )}
          </div>

          {/* Business Model Field */}
          <div>
            <Label>Business Model</Label>
            <Input {...register("businessModel")} />
            {errors.businessModel && <p className="text-red-500 text-sm">{errors.businessModel.message}</p>}
          </div>

          {/* Valuation Field */}
          <div>
            <Label>Valuation ($)</Label>
            <Input type="number" {...register("valuation", { valueAsNumber: true })} />
            {errors.valuation && <p className="text-red-500 text-sm">{errors.valuation.message}</p>}
          </div>

          {/* Funding Companies Field */}
          <div>
            <Label>Funding Companies (comma separated)</Label>
            <Controller
              name="funding_companies"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.split(",").map((c) => c.trim()))}
                />
              )}
            />
            {errors.funding_companies && (
              <p className="text-red-500 text-sm">At least one funding company is required.</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Startup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
