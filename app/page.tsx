"use client";

import { useEffect, useState } from "react";
import { useSession } from "./lib/auth-client";
import { useRouter } from "next/navigation";
import MessageCard from "./components/message";
import SortFilterControls from "./components/SortFilterControls";
import AdviceForm from "./components/AdviceForm";
import { Plus } from "lucide-react";
import { useStudentProfile } from "./hooks/useStudentProfile";

// interface StudentProfile {
//   id: number;
//   username: string;
//   position: string;
//   linkedinUrl: string | null;
//   gitHubUrl: string | null;
// }

// Database interfaces (from API)
export interface AdviceStudent {
  id: number;
  username: string;
  position: string;
  linkedinUrl: string | null;
  gitHubUrl: string | null;
}

export interface AdviceLike {
  id: number;
  studentId: number;
  adviceId: number;
  createdAt: Date;
}

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

export type AdviceCategories =
  | "Carreer"
  | "Coding"
  | "Design System"
  | "Security";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { studentProfile, loading: loadingProfile } = useStudentProfile(
    session?.user?.id,
    isPending
  );
  // const [messages, setMessages] = useState<Message[]>(initialMessages);

  const [advices, setAdvices] = useState<Advice[]>([]);
  const [filteredAdvices, setFilteredAdvices] = useState<Advice[]>([]);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/advices");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setAdvices(data.advices);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Wisdom Wall</h1>
            <p className="text-sm text-slate-500">Conseils Data</p>
          </div>
          <div className="flex items-center gap-3">
            {isPending || loadingProfile ? (
              <div className="text-sm text-slate-500">Chargement...</div>
            ) : session?.user && studentProfile ? (
              <>
                <span className="text-sm text-slate-600">
                  Bonjour, {studentProfile.username}
                </span>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/sign-in")}
                  className="px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => router.push("/sign-up")}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Créer un compte
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Form Section */}

        {/*        
        {showForm && (
          <AdviceForm
            onSubmit={handleAdviceSubmit}
            onCancel={() => setShowForm(false)}
          />
        )} */}

        {/* Messages Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <SortFilterControls
              advices={advices}
              onFilteredChange={setFilteredAdvices}
            />

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              {showForm ? (
                "Fermer"
              ) : (
                <div className="flex items-center gap-2">
                  <Plus></Plus> Nouveau conseil
                </div>
              )}
            </button>
          </div>

          <ul className="space-y-3">
            {filteredAdvices.map((advice: Advice) => (
              <MessageCard key={advice.id} advice={advice} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
