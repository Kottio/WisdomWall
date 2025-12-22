import React from "react";
import {
  Code2,
  BarChart3,
  Database,
  PieChart,
  Briefcase,
  Wrench,
} from "lucide-react";
import { AdviceCategories } from "../types/advice";

// Liste des catégories
export const categories: Array<AdviceCategories | "Tous"> = [
  "Tous",
  "Programmation",
  "Analyse de Données",
  "Ingénierie Données",
  "Visualisation",
  "Carrière & Portfolio",
  "Outils & Workflow",
];

// Couleurs par catégorie (pour les icônes)
export const categoryColors: Record<string, string> = {
  Programmation: "text-blue-600",
  "Analyse de Données": "text-emerald-600",
  "Ingénierie Données": "text-purple-600",
  Visualisation: "text-pink-600",
  "Carrière & Portfolio": "text-amber-600",
  "Outils & Workflow": "text-slate-600",
};

// Styles de badge par catégorie (pour les posts)
export const categoryStyles: Record<string, string> = {
  Programmation: "bg-blue-100 text-blue-700",
  "Analyse de Données": "bg-emerald-100 text-emerald-700",
  "Ingénierie Données": "bg-purple-100 text-purple-700",
  Visualisation: "bg-pink-100 text-pink-700",
  "Carrière & Portfolio": "bg-amber-100 text-amber-700",
  "Outils & Workflow": "bg-slate-100 text-slate-700",
};

/**
 * Retourne l'icône Lucide pour une catégorie
 * @param category - Nom de la catégorie
 * @param isColored - Si true, applique la couleur de la catégorie
 * @param size - Taille de l'icône (défaut: "w-3.5 h-3.5")
 */
export const getCategoryIcon = (
  category: string,
  isColored: boolean = false,
  size: string = "w-3.5 h-3.5"
): React.ReactElement | null => {
  const iconClass = isColored
    ? `${size} ${categoryColors[category]}`
    : size;

  const icons: Record<string, React.ReactElement> = {
    Programmation: <Code2 className={iconClass} />,
    "Analyse de Données": <BarChart3 className={iconClass} />,
    "Ingénierie Données": <Database className={iconClass} />,
    Visualisation: <PieChart className={iconClass} />,
    "Carrière & Portfolio": <Briefcase className={iconClass} />,
    "Outils & Workflow": <Wrench className={iconClass} />,
  };

  return icons[category] || null;
};

/**
 * Retourne les classes CSS de style pour un badge de catégorie
 * @param category - Nom de la catégorie
 */
export const getCategoryStyle = (category: string): string => {
  return categoryStyles[category] || "bg-gray-100 text-gray-700";
};
