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

type SocialLinkProps = {
  profileUrl: string;
  onClose: () => void;
};

export default function SocialLink({ profileUrl, onClose }: SocialLinkProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    alert("Link copied to clipboard!");
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
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="text-blue-500" />,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
    },
    {
      name: "Discord",
      icon: <FaDiscord className="text-indigo-400" />,
      action: handleCopy,
    },
    {
      name: "Email",
      icon: <FaEnvelope className="text-amber-400" />,
      link: `mailto:?subject=Check%20this%20out&body=${encodeURIComponent(profileUrl)}`,
    },
    {
      name: "Reddit",
      icon: <FaReddit className="text-orange-500" />,
      link: `https://www.reddit.com/submit?url=${encodeURIComponent(profileUrl)}`,
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-[#0d1117] text-white rounded-2xl p-6 w-96 shadow-2xl border border-[#1f2937]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Share Profile</h2>
          <button
            onClick={onClose}
            className="hover:text-gray-400 transition-colors">
            <FaXmark className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {shareLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => item.link ? window.open(item.link, "_blank") : item.action?.()}
              className="flex flex-col items-center justify-center bg-[#161b22] rounded-xl p-3 hover:bg-[#1c2128] transition-colors">
              <div className="text-2xl mb-1">{item.icon}</div>
              <span className="text-sm text-gray-200">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
