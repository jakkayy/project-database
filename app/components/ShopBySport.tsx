"use client";

import { useRef } from "react";
import SportCard from "./SportCard";

const sports = [
  {
    image: "/sports/running.svg",
    label: "Running",
  },
  {
    image: "/sports/football.svg",
    label: "Football",
  },
  {
    image: "/sports/basketball.svg",
    label: "Basketball",
  },
  {
    image: "/sports/training.svg",
    label: "Training",
  },
];

export default function ShopBySport() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-10 py-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">
          Shop By Sport
        </h2>
        <div className="flex items-center gap-3">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center border border-neutral-700 bg-neutral-900 text-neutral-300 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable sport list */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {sports.map((sport, index) => (
          <SportCard key={index} {...sport} />
        ))}
      </div>
    </section>
  );
}
