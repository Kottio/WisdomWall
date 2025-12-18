"use client";

import { useState } from "react";
import MessageCard from "./components/message";

export interface Comment {
  id: number;
  user: string;
  text: string;
  createdAt: Date;
}

export interface Message {
  id: number;
  user: string;
  message: string;
  userPosition: string;
  likeCount: number;
  createdAt: Date;
  categories: AdviceCategories;
  linkedinUrl?: string;
  resourceUrl?: string;
  comments: Comment[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    user: "DataPro",
    message:
      "Toujours documenter vos pipelines de données. Votre futur vous remerciera!",
    userPosition: "Senior Data Engineer",
    likeCount: 1,
    createdAt: new Date("2025-12-10"),
    categories: "Coding",
    linkedinUrl: "https://linkedin.com/in/datapro",
    comments: [
      {
        id: 1,
        user: "JuniorDev",
        text: "Excellent conseil! J'ai appris ça à mes dépens 😅",
        createdAt: new Date("2025-12-11"),
      },
      {
        id: 2,
        user: "DataLead",
        text: "100% d'accord. La documentation c'est la base!",
        createdAt: new Date("2025-12-12"),
      },
    ],
  },
  {
    id: 2,
    user: "AnalyticsGuru",
    message:
      "La qualité des données est plus importante que la quantité. Investissez dans la validation.",
    userPosition: "Data Analyst",
    likeCount: 2,
    createdAt: new Date("2025-12-15"),
    categories: "Coding",
    comments: [],
  },
  {
    id: 3,
    user: "MLExpert",
    message:
      "Ne jamais sous-estimer l'importance du nettoyage des données avant l'analyse.",
    userPosition: "Machine Learning Engineer",
    likeCount: 0,
    createdAt: new Date("2025-12-17"),
    categories: "Carreer",
    linkedinUrl: "https://linkedin.com/in/mlexpert",
    comments: [
      {
        id: 1,
        user: "DataScientist",
        text: "Tellement vrai! 80% du temps sur le nettoyage...",
        createdAt: new Date("2025-12-17"),
      },
    ],
  },
];

export type AdviceCategories =
  | "Carreer"
  | "Coding"
  | "Design System"
  | "Security";
type SortOption = "most-liked" | "recent";
type TimeLimit = "all-time" | "month";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showForm, setShowForm] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<AdviceCategories>("Coding");
  const [sortBy, setSortBy] = useState<SortOption>("most-liked");
  const [timeLimit, setTimeLimit] = useState<TimeLimit>("all-time");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    const message: Message = {
      id: Date.now(),
      user: "CurrentUser", // À remplacer par l'utilisateur connecté
      message: newMessage,
      userPosition: "Data Enthusiast", // À remplacer par le rôle de l'utilisateur
      likeCount: 0,
      createdAt: new Date(),
      categories: selectedCategory,
      resourceUrl: resourceUrl.trim() || undefined,
      comments: [],
    };

    setMessages([message, ...messages]);

    setNewMessage("");
    setResourceUrl("");
    setSelectedCategory("Coding");
    setShowForm(false);
  };

  const getSortedMessages = () => {
    let messagesCopy = [...messages];

    // Filter by time limit
    if (timeLimit === "month") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      messagesCopy = messagesCopy.filter((msg) => {
        return new Date(msg.createdAt) >= thirtyDaysAgo;
      });
    }

    // Sort
    if (sortBy === "most-liked") {
      return messagesCopy.sort((a, b) => b.likeCount - a.likeCount);
    } else {
      return messagesCopy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Wisdom Wall</h1>
            <p className="text-sm text-slate-500">Conseils Data</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            {showForm ? "Fermer" : "Nouveau conseil"}
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Form Section */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Partager un nouveau conseil
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Catégorie *
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as AdviceCategories)
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer"
                  required
                >
                  <option value="Coding">Coding</option>
                  <option value="Carreer">Carreer</option>
                  <option value="Design System">Design System</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Conseil *
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Partagez votre conseil..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Lien vers une ressource (optionnel)
                </label>
                <input
                  type="url"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Lien vers un article, vidéo ou ressource pertinente
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Messages Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            {/* Sort Buttons and Time Filter */}
            <div className="flex gap-3 items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("most-liked")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    sortBy === "most-liked"
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Plus aimés
                </button>
                <button
                  onClick={() => setSortBy("recent")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    sortBy === "recent"
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Récents
                </button>
              </div>

              {/* Time Limit Buttons */}
              <div className="flex gap-2 pl-5">
                <button
                  onClick={() => setTimeLimit("all-time")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    timeLimit === "all-time"
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Tout le temps
                </button>
                <button
                  onClick={() => setTimeLimit("month")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    timeLimit === "month"
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Ce mois
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              {getSortedMessages().length} conseil
              {getSortedMessages().length > 1 ? "s" : ""}
            </p>
          </div>

          <ul className="space-y-3">
            {getSortedMessages().map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
