import Link from "next/link";

export default function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  showHomeLink = true,
}: {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="max-w-lg rounded-2xl bg-white/10 p-8 text-center shadow-lg backdrop-blur-md">
        <h1 className="mb-3 text-3xl font-bold text-red-400">{title}</h1>
        <p className="mb-6 text-lg text-gray-300">{message}</p>

        {showHomeLink && (
          <Link
            href="/"
            className="rounded-xl bg-purple-500 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-purple-400"
          >
            Return Home
          </Link>
        )}
      </div>
    </div>
  );
}
