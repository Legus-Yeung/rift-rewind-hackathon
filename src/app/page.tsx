import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import SummonerInput from "./_components/summoner-input";
import Background from "./_components/background";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <Background imageUrl="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/a6f94cd5ed222d3b99e535f17cd9592d3c716bb5-3840x1616.png?auto=format&fit=fill&q=80&h=945">
      <main className="flex min-h-screen flex-col items-center justify-center text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Rift <span>Rewind</span>
          </h1>
          <SummonerInput />
        </div>
      </main>
      </Background>
    </HydrateClient>
  );
}
