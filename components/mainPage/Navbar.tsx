"use client";

import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleHomeClick = () => {
    console.log("this handle home click was called")
    router.push("/");
    router.refresh(); 
    // setTimeout(() => {
    //   window.location.href = "/";
    // }, 100);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-12 left-1/2 -translate-x-1/2 text-white rounded-full px-10 py-3 items-center justify-between shadow-lg w-fit max-w-full gap-10 z-50">
       <button onClick={handleHomeClick} className="nav-link group relative">
          Spark
          <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </button>
        <button onClick={() => handleScroll("about")} className="nav-link group relative">
          About Us
          <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </button>
        <button onClick={() => router.push("/dashboard")} className="nav-link group relative">
          Dashboard
          <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </button>
        <button onClick={() => router.push("/startups")} className="nav-link group relative">
          Startups
          <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </button>
        <button
          className="px-5 py-2 bg-primary rounded-full text-white font-semibold text-base cursor-pointer hover:bg-opacity-80 transition"
          onClick={() => router.push("/registration")}
        >
          Register Now
        </button>
      </nav>

      {/* Mobile "Stair-Step" Layout */}
      <div className="md:hidden absolute top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white text-lg w-full z-50">
        {/* First Row */}
        <div className="flex justify-between w-[80%] mb-2">
          <button onClick={() => handleScroll("spark")} className="stair-link group relative">
            Spark
            <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
          <button onClick={() => handleScroll("about")} className="stair-link group relative">
            About Us
            <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
        </div>

        {/* Second Row */}
        <div className="flex justify-between w-[60%] mb-2">
          <button onClick={() => router.push("/dashboard")} className="stair-link group relative">
            Dashboard
            <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
          <button onClick={() => router.push("/startups")} className="stair-link group relative">
            Startups
            <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
        </div>

        {/* Register Now */}
        <button
          onClick={() => router.push("/registration")}
          className="stair-link group bg-primary px-4 py-2 rounded-md mt-4 relative"
        >
          Register Now
          <span className="absolute left-0 bottom-[-3px] w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </button>
      </div>
    </>
  );
}
