import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import logo from "@/assets/icon-logo.svg"; // Adjust path as needed

const LandingPage: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        progress.current = Math.min(progress.current + e.deltaY * 0.01, 100);
      } else {
        progress.current = Math.max(progress.current + e.deltaY * 0.01, 10);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    const animate = (time: number) => {
      const p = progress.current / 100;
      const t = time * 0.001;

      const r1 = Math.floor(200 + 55 * Math.sin(t));
      const g1 = Math.floor(100 + 100 * Math.sin(t + 1));
      const b1 = Math.floor(150 + 100 * Math.sin(t + 2));

      const r2 = Math.floor(50 + 200 * Math.sin(t + 3));
      const g2 = Math.floor(50 + 200 * Math.sin(t + 4));
      const b2 = Math.floor(255 * Math.sin(t + 5));

      const r3 = Math.floor(255 * Math.abs(Math.sin(t + 6)));
      const g3 = Math.floor(200 * Math.abs(Math.sin(t + 7)));
      const b3 = Math.floor(100 + 155 * Math.sin(t + 8));

      const height = 0.5 + p * (200 - 0.5);
      const radius = 9999 - p * (9999 - 8);
      const opacity = 0.5 + p * 0.5;

      if (barRef.current) {
        barRef.current.style.height = `${height}px`;
        barRef.current.style.borderRadius = `${radius}px`;
        barRef.current.style.opacity = `${opacity}`;
        barRef.current.style.backgroundImage = `linear-gradient(to right, rgb(${r1},${g1},${b1}), rgb(${r2},${g2},${b2}), rgb(${r3},${g3},${b3}))`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 text-sm relative z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="AutoVideoGen Logo" className="w-6 h-6 filter invert" />
          <span className="text-white font-semibold text-xl">AutoVideoGen</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex flex-wrap justify-center gap-6">
          {["Templates", "How it works", "Features", "About", "Company"].map((item) => (
            <a key={item} href="#" className="hover:text-gray-400 text-sm sm:text-base">
              {item}
            </a>
          ))}
        </div>

        {/* Login Button */}
        <div className="hidden sm:flex gap-3 items-center">
          <a href="/login">
            <button className="bg-white text-black rounded-full px-5 py-2 text-xs font-medium hover:opacity-90 transition">
              Login
            </button>
          </a>
        </div>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col items-center gap-4 py-4 px-6 bg-black text-white border-t border-gray-700 z-40">
          {["Templates", "How it works", "Features", "About", "Company"].map((item) => (
            <a key={item} href="#" className="hover:text-gray-400 text-sm">
              {item}
            </a>
          ))}
          <a href="/login" className="w-full">
            <button className="w-full bg-white text-black rounded-full px-5 py-2 text-xs font-medium hover:opacity-90 transition">
              Login
            </button>
          </a>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6 mt-16 sm:mt-24">
        <p className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">
          Generate videos using AI templates
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold mt-4 leading-snug">
          Videos in minutes, <br />
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            not hours
          </span>
        </h1>

        {/* Scroll & Animated Bar */}
        <div
          ref={barRef}
          style={{
            height: "0.5rem",
            borderRadius: "9999px",
            opacity: 0.5,
            transition: "height 0.3s ease, border-radius 0.3s ease, opacity 0.3s ease",
          }}
          className="mt-16 w-[90%] sm:w-full max-w-xs sm:max-w-lg blur-md border border-gray-700 shadow-inner"
        />

        {/* CTA */}
        <p className="text-gray-400 text-xs sm:text-sm mt-8 text-center max-w-xs sm:max-w-md">
          Early access available for the first 150 users every week
        </p>
        <button className="mt-4 bg-white text-black rounded-full px-6 py-2 text-sm font-medium hover:scale-105 transition">
          Get early access
        </button>

        <button className="mt-3 text-gray-400 text-sm underline hover:text-white">
          Watch Demo Video
        </button>
      </main>
    </div>
  );
};

export default LandingPage;
