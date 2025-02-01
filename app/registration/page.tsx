"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { toast } from "@/hooks/use-toast";
import { Loader2, User, Users, ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";

const MemberSchema = z.object({
  name: z.string().min(1, "Member name cannot be empty"),
  enrollmentNumber: z.string().min(5, "Enrollment number is required"),
});

const SignupSchema = z.object({
  name: z.string().min(1, "Member name cannot be empty"),
  enrollmentNumber: z.string().min(5, "Enrollment number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  team_name: z.string().min(3, "Team name must be at least 3 characters"),
  additionalMembers: z
    .array(MemberSchema)
    .min(1, "A team must have at least 2 members")
    .max(4, "A team cannot have more than 5 members in total"),
});

type RegistrationData = z.infer<typeof SignupSchema>;

export default function RegistrationPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistrationData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      enrollmentNumber: "",
      password: "",
      team_name: "",
      additionalMembers: [{ name: "", enrollmentNumber: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "additionalMembers",
    control: form.control,
  });

  const onSubmit = async (data: RegistrationData) => {
    setIsLoading(true);
    // console.log("Submitting Data:", data);
    try {
      const response = await axios.post("/api/teams/signup", data, {
        headers: { "Content-Type": "application/json" },
      });
  
      // console.log("Server Response:", response);
  
      if (response.status === 201) {
        toast({
          title: "Registration Successful",
          description: "Your team has been created successfully.",
        });
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard");
      } else {
        console.error("Registration Error:", response.data);
        toast({
          title: "Registration Failed",
          description: response.data.error || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Axios Error:", error.response?.data || error.message);
      toast({
        title: "Registration Failed",
        description: `An error occurred: ${error.response?.data?.error || error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const steps = [
    {
      title: "Team Leader Details",
      fields: ["name", "enrollmentNumber", "password"],
    },
    { title: "Team Details", fields: ["team_name"] },
    { title: "Additional Members", fields: ["additionalMembers"] },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-gray-800 shadow-lg rounded-2xl p-8 space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-2">Team Registration</h1>
            <p className="text-gray-400">
              Step {step + 1} of 3: {steps[step].title}
            </p>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 0 && (
                    <>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Team Leader Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Enter your name"
                                  {...field}
                                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                                />
                                <User
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  size={18}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="enrollmentNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Enrollment Number
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Enter your enrollment number"
                                  {...field}
                                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                                />
                                <User
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  size={18}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  {...field}
                                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                                />
                                <User
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  size={18}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  {step === 1 && (
                    <FormField
                      control={form.control}
                      name="team_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">
                            Team Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter your team name"
                                {...field}
                                className="pl-10 bg-gray-700 border-gray-600 text-white"
                              />
                              <Users
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  )}
                  {step === 2 && (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`additionalMembers.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">
                                  Member Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter member name"
                                    {...field}
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`additionalMembers.${index}.enrollmentNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">
                                  Enrollment Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter enrollment number"
                                    {...field}
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => remove(index)}
                              className="mt-2 w-full"
                            >
                              Remove Member
                            </Button>
                          )}
                        </div>
                      ))}
                      {fields.length < 4 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            append({ name: "", enrollmentNumber: "" })
                          }
                          className="mt-4 w-full"
                        >
                          Add Member
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8 space-x-2">
                {step > 0 && (
                  <Button type="button" onClick={prevStep} variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                )}
                {step < 2 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={step === 0 ? "ml-auto" : ""}
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={step === 0 ? "ml-auto" : ""}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register Team"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}