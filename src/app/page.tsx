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
        </div>
      </main>
    </HydrateClient>
  );
}
