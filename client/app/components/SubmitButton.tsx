"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SubmitButton() {
  const [href, setHref] = useState("/create-user");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setHref(storedUserId ? "/submit-exam" : "/create-user");
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <Link
        href={href}
        className="w-12 h-12 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-colors duration-200"
        title="Create user or submit exam"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </Link>
      <p className="text-xs text-gray-500 text-center max-w-[80px]">
        Add user exam info
      </p>
    </div>
  );
}

