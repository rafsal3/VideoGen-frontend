import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 text-sm">
        <div className="text-white font-semibold">Imagica</div>
        <div className="flex gap-6">
          {["Product", "How it works", "Features", "Mission", "Company"].map((item) => (
            <a key={item} href="#" className="hover:text-gray-400">
              {item}
            </a>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <button className="border border-gray-600 rounded-full px-4 py-1 text-white text-xs hover:bg-white hover:text-black transition">
            Enterprise
          </button>
          <button className="bg-white text-black rounded-full px-5 py-1 text-xs font-medium hover:opacity-90 transition">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-4 mt-20">
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          Build a no-code AI app in minutes
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold mt-4">
          Create at the <br />
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Speed of Thought
          </span>
        </h1>

        {/* Glowing bar */}
        <div className="mt-16 w-full max-w-md h-2 bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 rounded-full shadow-lg blur-md"></div>

        {/* CTA Button */}
        <p className="text-gray-400 text-sm mt-6">
          We allocate 150 free invites every week
        </p>
        <button className="mt-4 bg-white text-black rounded-full px-6 py-2 font-medium hover:scale-105 transition">
          Get early access
        </button>

        <button className="mt-4 text-gray-400 text-sm underline hover:text-white">
          Play Video Demo
        </button>
      </main>
    </div>
  );
};

export default LandingPage;
