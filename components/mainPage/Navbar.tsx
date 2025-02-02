"use client"
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-12 left-1/2 -translate-x-1/2 bg-neutral-900 rounded-full px-10 py-3 flex items-center justify-between shadow-lg w-fit max-w-full gap-10">
      <div className="hidden md:flex gap-10 text-base text-gray-300 mx-auto">
        <a href="#" className="hover:text-white cursor-pointer">Spark</a>
        <a href="#" className="hover:text-white cursor-pointer">About Us</a>
        <a href="#" className="hover:text-white cursor-pointer">Dashboard</a>
        <a href="#" className="hover:text-white cursor-pointer">Startups</a>
      </div>
      <button
        className="px-5 py-2 bg-primary rounded-full text-white font-semibold text-base cursor-pointer"
        onClick={() => router.push("/register")} 
      >
        Register Now
      </button>
    </nav>
  );
}
