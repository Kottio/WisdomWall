import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { identify } from "../lib/events";

interface StudentProfile {
  id: number;
  username: string;
  position: string;
  linkedinUrl: string | null;
  gitHubUrl: string | null;
}

export function useStudentProfile(
  userId: string | undefined,
  isPending: boolean
) {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/student/me");
        const data = await response.json();

        if (data.student) {
          setStudentProfile(data.student);
          identify(data.student.id);
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      fetchStudentProfile();
    }
  }, [userId, isPending, router]);

  return { studentProfile, loading };
}
