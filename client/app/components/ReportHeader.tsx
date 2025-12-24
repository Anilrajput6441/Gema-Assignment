"use client";

import Link from "next/link";

export default function ReportHeader() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Link
        href="/submit"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
      >
        Submit Assessment
      </Link>
    </div>
  );
}

