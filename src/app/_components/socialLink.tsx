"Use Client";

import {
  FaLink,
  FaXTwitter,
  FaFacebook,
  FaDiscord,
  FaEnvelope,
  FaReddit,
  FaXmark,
} from "react-icons/fa6";
import { usePathname } from "next/navigation";

interface SocialLinkProps {
  onClose: () => void;
}

export default function SocialLink({ onClose }: SocialLinkProps) {
  const pathname = usePathname();
  const fullUrl = `${window.location.origin}${pathname}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLinks = [
    {
      name: "Copy Link",
      icon: <FaLink className="text-gray-300" />,
      action: handleCopy,
    },
    {
      name: "Twitter",
      icon: <FaXTwitter className="text-white-400" />,
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="text-blue-500" />,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    },
    {
      name: "Discord",
      icon: <FaDiscord className="text-indigo-400" />,
      action: handleCopy,
    },
    {
      name: "Email",
      icon: <FaEnvelope className="text-amber-400" />,
      link: `mailto:?subject=Check%20this%20out&body=${encodeURIComponent(fullUrl)}`,
    },
    {
      name: "Reddit",
      icon: <FaReddit className="text-orange-500" />,
      link: `https://www.reddit.com/submit?url=${encodeURIComponent(fullUrl)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-96 rounded-2xl border border-[#1f2937] bg-[#0d1117] p-6 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Share Profile</h2>
          <button
            onClick={onClose}
            className="transition-colors hover:text-gray-400"
          >
            <FaXmark className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {shareLinks.map((item) => (
            <button
              key={item.name}
              onClick={() =>
                item.link ? window.open(item.link, "_blank") : item.action?.()
              }
              className="flex flex-col items-center justify-center rounded-xl bg-[#161b22] p-3 transition-colors hover:bg-[#1c2128]"
            >
              <div className="mb-1 text-2xl">{item.icon}</div>
              <span className="text-sm text-gray-200">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
