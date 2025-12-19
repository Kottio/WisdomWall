import { useState } from "react";
import { AdviceCategories } from "../page";

interface AdviceFormData {
  message: string;
  category: AdviceCategories;
  resourceUrl: string;
}

interface AdviceFormProps {
  onSubmit: (data: AdviceFormData) => void;
  onCancel: () => void;
}

export default function AdviceForm({ onSubmit, onCancel }: AdviceFormProps) {
  const [newMessage, setNewMessage] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<AdviceCategories>("Coding");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    onSubmit({
      message: newMessage,
      category: selectedCategory,
      resourceUrl: resourceUrl.trim(),
    });

    // Reset form
    setNewMessage("");
    setResourceUrl("");
    setSelectedCategory("Coding");
  };

  return (
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
