// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { NavbarTwo } from "@/components/startupUi/NavbarTwo";

// interface Startup {
//   startup_id: number;
//   _id: string;
//   name: string;
//   description: string;
//   valuation?: number;
//   highestBid?: number;
//   ownerTeam?: string;
//   currentBidAmount?: number;
//   industry?: string;
//   problemItSolves?: string;
//   businessModel?: string;
//   fundingCompanies?: string[];
//   bid_session?: boolean;  // Added bid_session property
// }

// export default function AuctionPage() {
//   const [startups, setStartups] = useState<Startup[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

//   useEffect(() => {
//     const fetchStartups = async () => {
//       try {
//         const response = await axios.get("/api/user-startups");

//         if (response.data.success && Array.isArray(response.data.startups)) {
//           // Filter startups with active bid_session
//           const filteredStartups = response.data.startups.filter(
//             (startup: { bid_session: boolean; }) => startup.bid_session === true
//           );
//           setStartups(filteredStartups);
//         } else {
//           setError("No startups found. Please try again.");
//           setStartups([]);
//         }
//       } catch (err) {
//         setError("Failed to load startups. Please try again.");
//         console.error("Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStartups();
//   }, []);

//   const filteredStartups = startups.filter(
//     (startup) =>
//       startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(startup.startup_id).includes(searchTerm)
//   );

//   const handleOpenModal = (startup: Startup) => {
//     setSelectedStartup(startup);
//   };

//   return (
//     <main className="relative min-h-screen bg-[#f0ecec] flex flex-col overflow-hidden">
//       <NavbarTwo />
//       <div className="container max-w-[85rem] mt-[5rem] mx-auto py-6 min-h-screen bg-background text-foreground">
//         <h1 className="text-4xl sm:text-5xl font-extrabold text-center mt-8 mb-12">
//           Spark Startup Auction
//         </h1>
//         <Input
//           className="w-full max-w-md mx-auto mb-8"
//           placeholder="Search by company name or description..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         {loading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
//             {[...Array(6)].map((_, index) => (
//               <Card key={index} className="w-full h-64 flex flex-col">
//                 <CardHeader className="flex-grow">
//                   <Skeleton className="h-6 w-3/4 mb-4" />
//                   <Skeleton className="h-4 w-full mb-2" />
//                   <Skeleton className="h-4 w-5/6" />
//                 </CardHeader>
//                 <CardContent>
//                   <Skeleton className="h-5 w-24 mb-2" />
//                   <Skeleton className="h-4 w-32" />
//                 </CardContent>
//                 <CardFooter>
//                   <Skeleton className="h-6 w-24" />
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         )}

//         {!loading && error && (
//           <div className="text-center text-red-500 text-xl">{error}</div>
//         )}

//         {!loading && !error && startups.length === 0 && (
//           <div className="text-center text-xl">No startups available</div>
//         )}

//         {!loading && !error && startups.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
//             {filteredStartups.map((startup) => (
//               <Card
//                 key={startup._id}
//                 className="cursor-pointer hover:shadow-lg transition-shadow h-64 flex flex-col"
//                 onClick={() => handleOpenModal(startup)}
//               >
//                 <CardHeader className="flex-grow">
//                   <CardTitle className="text-xl mb-2">{startup.name}</CardTitle>
//                   <p className="text-sm text-muted-foreground line-clamp-2">
//                     {startup.description}
//                   </p>
//                 </CardHeader>
//                 <CardContent>
//                   {startup.industry && (
//                     <Badge className="mb-2">{startup.industry}</Badge>
//                   )}
//                   {startup.valuation && (
//                     <p className="text-sm">
//                       Valuation: ${startup.valuation.toLocaleString()}
//                     </p>
//                   )}
//                 </CardContent>
//                 <CardContent>
//                   {startup.industry && (
//                     <Badge className="mb-2">{startup.startup_id}</Badge>
//                   )}
//                 </CardContent>
//                 <CardFooter className="flex flex-wrap gap-2">
//                   {startup.fundingCompanies &&
//                     startup.fundingCompanies.slice(0, 2).map((funding, index) => (
//                       <Badge key={index} variant="secondary">
//                         {funding}
//                       </Badge>
//                     ))}
//                   {startup.fundingCompanies &&
//                     startup.fundingCompanies.length > 2 && (
//                       <Badge variant="secondary">
//                         +{startup.fundingCompanies.length - 2}
//                       </Badge>
//                     )}
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         )}

//         <Dialog
//           open={!!selectedStartup}
//           onOpenChange={() => setSelectedStartup(null)}
//         >
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>{selectedStartup?.name}</DialogTitle>
//               <DialogDescription>{selectedStartup?.industry}</DialogDescription>
//             </DialogHeader>
//             <ScrollArea className="mt-4 h-[60vh] pr-4">
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-semibold">Description</h3>
//                   <p>{selectedStartup?.description}</p>
//                 </div>
//                 {selectedStartup?.problemItSolves && (
//                   <div>
//                     <h3 className="font-semibold">Problem It Solves</h3>
//                     <p>{selectedStartup.problemItSolves}</p>
//                   </div>
//                 )}
//                 {selectedStartup?.businessModel && (
//                   <div>
//                     <h3 className="font-semibold">Business Model</h3>
//                     <p>{selectedStartup.businessModel}</p>
//                   </div>
//                 )}
//                 {selectedStartup?.valuation && (
//                   <div>
//                     <h3 className="font-semibold">Valuation</h3>
//                     <p>${selectedStartup.valuation.toLocaleString()}</p>
//                   </div>
//                 )}
//                 {selectedStartup?.highestBid && (
//                   <div>
//                     <h3 className="font-semibold">Highest Bid</h3>
//                     <p>${selectedStartup.highestBid.toLocaleString()}</p>
//                   </div>
//                 )}
//                 {selectedStartup?.currentBidAmount && (
//                   <div>
//                     <h3 className="font-semibold">Current Bid Amount</h3>
//                     <p>${selectedStartup.currentBidAmount.toLocaleString()}</p>
//                   </div>
//                 )}
//                 {selectedStartup?.ownerTeam && (
//                   <div>
//                     <h3 className="font-semibold">Owner Team</h3>
//                     <p>{selectedStartup.ownerTeam}</p>
//                   </div>
//                 )}
//                 {selectedStartup?.fundingCompanies &&
//                   selectedStartup.fundingCompanies.length > 0 && (
//                     <div>
//                       <h3 className="font-semibold">Funding Companies</h3>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {selectedStartup.fundingCompanies.map(
//                           (company, index) => (
//                             <Badge key={index} variant="secondary">
//                               {company}
//                             </Badge>
//                           )
//                         )}
//                       </div>
//                     </div>
//                   )}
//               </div>
//             </ScrollArea>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </main>
//   );
// }

"use client";

import { Navbar } from "@/components/mainPage/Navbar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const EVENT_START_TIME = new Date("2025-02-07T18:00:00Z").getTime();

export default function EventTimer() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [eventStarted, setEventStarted] = useState(false);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = EVENT_START_TIME - now;

    if (difference <= 0) {
      setEventStarted(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/registration")
    }
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
<p className="text-4xl text-center text-white mt-4">This will show all the startup details once the event starts.</p>
      <h1 className="text-xl mt-8 font-bold mb-4">{eventStarted ? "Event Started!" : "Countdown to Event"}</h1>
        <div className="text-2xl flex gap-4">
          <span>{timeLeft.days}d</span>
          <span>{timeLeft.hours}h</span>
          <span>{timeLeft.minutes}m</span>
          <span>{timeLeft.seconds}s</span>
        </div>
    </div>
    </>
  );
}
