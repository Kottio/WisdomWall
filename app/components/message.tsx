"use client";

import { ThumbsUp } from "lucide-react";

interface MessageCardProps {
  message: {
    id: number;
    user: string;
    message: string;
    userPosition: string;
    likeCount: number;
  };
}

export default function MessageCard({ message }: MessageCardProps) {
  const handleVote = () => {};

  return (
    <li className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex gap-4">
        {/* Section de vote */}

        {/* Contenu du message */}
        <div className="flex-1">
          <p className="text-gray-800 text-lg mb-3 leading-relaxed">
            {message.message}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-purple-600">
              {message.user}
            </span>
            <span>•</span>
            <span>{message.userPosition}</span>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <span className="text-gray-500 text-xl">{message.likeCount}</span>
          <button onClick={() => handleVote()}>
            <ThumbsUp className="stroke-gray-500 " />
          </button>
        </div>
      </div>
    </li>
  );
}
