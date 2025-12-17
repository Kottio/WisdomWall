"use client";

import { useState } from "react";
import { ThumbsUp, Linkedin, MessageCircle } from "lucide-react";
import { Message } from "../page";

interface MessageCardProps {
  message: Message;
}

export default function MessageCard({ message }: MessageCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const handleVote = () => {};

  const getCategoryStyle = (category: string) => {
    const styles = {
      Carreer: "bg-emerald-100 text-emerald-700",
      Coding: "bg-blue-100 text-blue-700",
      "Design System": "bg-purple-100 text-purple-700",
      Security: "bg-red-100 text-red-700",
    };
    return styles[category as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  return (
    <li className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-slate-100">
      <div className="flex gap-5">
        {/* Contenu du message */}
        <div className="flex-1">
          {/* Message - PREMIER (Focus principal) */}
          <p className="text-slate-900 text-lg leading-relaxed mb-4 font-medium">
            {message.message}
          </p>

          {/* User Info - APRÈS le message */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-600 text-sm">
                {message.user}
              </span>
              {message.linkedinUrl && (
                <a
                  href={message.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                  aria-label="Voir le profil LinkedIn"
                  title="Connecter sur LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-blue-600 fill-blue-600" />
                </a>
              )}
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 text-sm">{message.userPosition}</span>
            </div>
          </div>

          {/* Metadata - EN BAS */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryStyle(
                message.categories
              )}`}
            >
              {message.categories}
            </span>
            <span className="text-slate-400 text-xs">
              {message.createdAt.toDateString()}
            </span>
          </div>

          {/* Bouton Commentaires */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              {message.comments.length}{" "}
              {message.comments.length > 1 ? "commentaires" : "commentaire"}
            </span>
          </button>

          {/* Section Commentaires */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
              {/* Liste des commentaires */}
              {message.comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-700 text-sm">
                      {comment.user}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {comment.createdAt.toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{comment.text}</p>
                </div>
              ))}

              {/* Formulaire pour ajouter un commentaire */}
              <div className="pt-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={2}
                />
                <button
                  onClick={() => {
                    // TODO: Ajouter le commentaire
                    setNewComment("");
                  }}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Commenter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vote Section */}
        <div className="flex flex-col items-center justify-start gap-2 pt-1">
          <button
            onClick={() => handleVote()}
            className="group p-3 rounded-xl bg-slate-50 hover:bg-purple-50 transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Voter pour ce conseil"
          >
            <ThumbsUp className="w-6 h-6 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </button>
          <span className="text-slate-600 text-base font-bold">{message.likeCount}</span>
        </div>
      </div>
    </li>
  );
}
