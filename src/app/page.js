import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans bg-gray-50">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Welcome to <span className="text-blue-600">Student Helper</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your centralized campus platform. Navigate the dropdowns above to manage your assignments, share study materials, and connect with your peers.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors text-lg">
            Get Started
          </Link>
          <Link href="/login" className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-6 rounded-lg shadow-md border border-gray-200 transition-colors text-lg">
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}