"use client";

import { useState } from "react";
import { ThumbsUp, MessageCircle, Link } from "lucide-react";
import type { Advice } from "../types/advice";
import CommentCard from "./comment";
import { track } from "../lib/events";
import { getCategoryIcon, getCategoryStyle } from "../utils/categoryUtils";

interface MessageCardProps {
  advice: Advice;
  studentId: number | undefined;
  refecth: () => void;
}

export default function MessageCard({
  advice,
  studentId,
  refecth,
}: MessageCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const likedByUser = studentId
    ? advice.likes.some((like) => like.studentId === studentId)
    : false;

  const toggleLike = async (adviceId: number, studentId: number) => {
    const response = await fetch(`/api/advices/${adviceId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data) {
        refecth();
        return data.liked;
      }
    }
  };

  const handleVote = async () => {
    if (studentId) {
      const liked = await toggleLike(advice.id, studentId);

      track("Liked_advice", {
        adviceId: advice.id,
        likedStatus: liked,
      });
    }
  };

  const addComment = async (
    newComment: string,
    studentId: number,
    adviceId = advice.id
  ) => {
    const response = await fetch(`/api/advices/${adviceId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newComment, studentId }),
    });

    if (response.ok) {
      const data = await response.json();
      return true;
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (studentId) {
      const added = await addComment(newComment, studentId, advice.id);
      if (added) {
        console.log("posted");
        refecth();
      }
      setNewComment("");
    }
  };

  return (
    <li className="bg-white rounded-2xl shadow-sm p-7 hover:shadow-md transition-all duration-300 border border-slate-100">
      <div className="flex gap-6">
        {/* Contenu du message */}
        <div className="flex-1">
          {/* Message - PREMIER (Focus principal) */}
          <p className="text-slate-900 text-lg leading-relaxed mb-5 font-medium">
            {advice.message}
          </p>

          {/* Resource Link Button - Only show if resourceUrl exists */}
          {advice.resourceUrl && (
            <a
              onClick={() => {
                if (studentId) track("open_link", { adviceId: advice.id });
              }}
              href={advice.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-all mb-6 w-fit group"
            >
              <Link className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span>Voir le Lien</span>
              <svg
                className="w-3 h-3 opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )}

          {/* User Info */}
          <div className="flex items-center gap-2 mb-5">
            <span className="font-bold text-purple-600 text-sm">
              {advice.student.username}
            </span>
            {advice.student.linkedinUrl && (
              <a
                onClick={() => {
                  if (studentId)
                    track("open_Linkdin", {
                      adviceId: advice.id,
                      linkedin_StudentId: advice.student.id,
                    });
                }}
                href={advice.student.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            )}
            <span className="text-slate-300">·</span>
            <span className="text-slate-400 text-sm">
              {advice.student.position}
            </span>
          </div>

          {/* Footer horizontal - Tout sur une ligne */}
          <div className="flex items-center gap-4 text-xs">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${getCategoryStyle(
                advice.category
              )}`}
            >
              {getCategoryIcon(advice.category)}
              {advice.category}
            </span>
            <span className="text-slate-400">
              {new Date(advice.createdAt).toLocaleDateString()}
            </span>
            <button
              onClick={() => {
                setShowComments(!showComments);
                if (studentId && !showComments) {
                  track("open_comments", {
                    adviceId: advice.id,
                  });
                }
              }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{advice.comments?.length || 0}</span>
            </button>
          </div>

          {/* Section Commentaires */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
              {/* Liste des commentaires */}
              {advice.comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment}></CommentCard>
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
                    handleAddComment();
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
            className={`group p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
              likedByUser ? "bg-purple-500 " : "bg-slate-50 hover:bg-purple-50"
            }`}
            aria-label="Voter pour ce conseil"
          >
            <ThumbsUp
              className={`w-6 h-6 transition-colors ${
                likedByUser
                  ? "text-white"
                  : "text-slate-400 group-hover:text-purple-600"
              }`}
            />
          </button>
          <span className="text-slate-600 text-base font-bold">
            {advice.likes.length}
          </span>
        </div>
      </div>
    </li>
  );
}
