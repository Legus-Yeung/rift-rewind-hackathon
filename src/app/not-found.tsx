import Background from "./_components/background";
import Image from "next/image";

export default function NotFound() {
  return (
    <Background imageUrl="https://img.freepik.com/free-photo/spotlight-shining-down-into-grunge-interior_1048-6921.jpg">
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <title>404 - Page Not Found | Rift Rewind</title>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <Image
          src="https://static.wikia.nocookie.net/leagueoflegends/images/e/e3/Despair_Emote.png/revision/latest?cb=20230316211031"
          alt="Amumu crying"
          width={256}
          height={256}/>

        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg">The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    </main>
    </Background>
  );
}
