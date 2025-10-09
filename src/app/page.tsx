import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import SummonerInput from "./_components/summoner-input";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Rift <span className="text-[hsl(280,100%,70%)]">Rewind</span>
          </h1>
          <SummonerInput />
          <div className="flex gap-4">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
            >
              View Dashboard
            </a>
            <a
              href="/chat"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
            >
              AI Assistant
            </a>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
