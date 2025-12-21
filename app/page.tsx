"use client";
import useSWR from "swr";
import { useState, useMemo } from "react";
import { useSession } from "./lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MessageCard from "./components/message";
import SortFilterControls from "./components/SortFilterControls";
import AdviceForm from "./components/AdviceForm";
import { Plus, Linkedin } from "lucide-react";
import { useStudentProfile } from "./hooks/useStudentProfile";
import type { Advice } from "./types/advice";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { studentProfile, loading: loadingProfile } = useStudentProfile(
    session?.user?.id,
    isPending
  );
  const { data, mutate } = useSWR("/api/advices", fetcher);
  const advices = useMemo(() => data?.advices || [], [data?.advices]);
  const [filteredAdvices, setFilteredAdvices] = useState<Advice[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAdviceSubmitted = () => {
    setShowForm(false);
    mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/kottioDev/face.PNG"
              alt="kottioDev Logo"
              width={70}
              height={70}
              className="rounded-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">KottioDev</h1>
                <a
                  href="https://www.linkedin.com/in/thomas-cottiaux-data-consultant/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
                <a
                  href="https://github.com/Kottio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <i className="bi bi-github"></i>
                </a>
              </div>
              <p className="text-sm text-slate-500">
                Apprendre les infrastructures data
              </p>
            </div>
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

        {showForm && studentProfile && (
          <AdviceForm
            onCancel={() => setShowForm(false)}
            studentId={studentProfile.id}
            onSubmit={handleAdviceSubmitted}
          />
        )}

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
              <MessageCard
                key={advice.id}
                advice={advice}
                studentId={studentProfile?.id}
                refecth={mutate}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
