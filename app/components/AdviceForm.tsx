import { useState } from "react";
import { AdviceCategories } from "../types/advice";

interface AdviceFormData {
  message: string;
  category: AdviceCategories;
  resourceUrl: string;
}

interface AdviceFormProps {
  onCancel: () => void;
  studentId: number;
  onSubmit: () => void;
}

export default function AdviceForm({
  onCancel,
  studentId,
  onSubmit,
}: AdviceFormProps) {
  const [newMessage, setNewMessage] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<AdviceCategories>("Programmation");

  const postMessage = async (advice: AdviceFormData, studentId: number) => {
    const response = await fetch("/api/advices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ advice, studentId }),
    });
    if (response.ok) {
      onSubmit();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    setNewMessage("");
    setResourceUrl("");
    setSelectedCategory("Programmation");

    const newAdvice: AdviceFormData = {
      message: newMessage,
      category: selectedCategory,
      resourceUrl: resourceUrl,
    };

    postMessage(newAdvice, studentId);
  };

  return (
    <div className="mb-8 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Partager un nouveau conseil
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Catégorie *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Programmation",
              "Analyse de Données",
              "Ingénierie Données",
              "Visualisation",
              "Carrière & Portfolio",
              "Outils & Workflow",
            ].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category as AdviceCategories)
                }
                className={`px-3 py-2 text-sm font-medium rounded-md border-2 transition-all ${
                  selectedCategory === category
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
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
            onClick={onCancel}
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
  );
}
