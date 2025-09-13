import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="mb-6 text-lg text-gray-600">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
