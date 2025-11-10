interface BackgroundProps {
  imageUrl?: string;
  videoUrl?: string;
  children: React.ReactNode;
}

export default function Background({ imageUrl, videoUrl, children }: BackgroundProps) {
  return (
    <div className="relative w-full h-full">
      {videoUrl ? (
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : imageUrl ? (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : null}

      {/* Overlay for darkening / text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

      {/* Children content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
