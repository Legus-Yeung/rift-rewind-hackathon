import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import Background from "./_components/background";
import HomeContent from "./_components/homeContent"; 

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <Background videoUrl="/videos/season2016.mp4">
        <main className="flex min-h-screen flex-col items-center justify-center text-white">
          <HomeContent />
        </main>
      </Background>
    </HydrateClient>
  );
}
