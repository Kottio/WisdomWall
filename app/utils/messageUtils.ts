import { Advice, AdviceCategories } from "../types/advice";

type SortOption = "most-liked" | "recent";
type TimeLimit = "all-time" | "month";

export function getSortedMessages(
  advice: Advice[],
  sortBy: SortOption,
  timeLimit: TimeLimit,
  category: AdviceCategories | "Tous" = "Tous"
): Advice[] {
  let AdviceCopy = [...advice];

  // Filter by category
  if (category !== "Tous") {
    AdviceCopy = AdviceCopy.filter((msg) => msg.category === category);
  }

  // Filter by time limit
  if (timeLimit === "month") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    AdviceCopy = AdviceCopy.filter((msg) => {
      return new Date(msg.createdAt) >= thirtyDaysAgo;
    });
  }

  // Sort
  if (sortBy === "most-liked") {
    return AdviceCopy.sort((a, b) => b.likes.length - a.likes.length);
  } else {
    return AdviceCopy.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
