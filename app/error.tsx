"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log error to an error reporting service
    // console.error(error)
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="mb-6 text-lg text-gray-600">
        An unexpected error has occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}
