// Student info in advice
export interface AdviceStudent {
  id: number;
  username: string;
  position: string;
  linkedinUrl: string | null;
  gitHubUrl: string | null;
}

// Like on an advice
export interface AdviceLike {
  id: number;
  studentId: number;
  adviceId: number;
  createdAt: Date;
}

// Comment on an advice
export interface AdviceComment {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  studentId: number;
  adviceId: number;
  student: {
    username: string;
  };
}

// Main advice interface
export interface Advice {
  id: number;
  message: string;
  category: string;
  resourceUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  studentId: number;
  student: AdviceStudent;
  likes: AdviceLike[];
  comments: AdviceComment[];
}

// Advice categories
export type AdviceCategories =
  | "Programmation"
  | "Analyse de Données"
  | "Ingénierie Données"
  | "Visualisation"
  | "Carrière & Portfolio"
  | "Outils & Workflow";
