import { AdviceComment } from "../types/advice";
interface commentProps {
  comment: AdviceComment;
}
export default function CommentCard({ comment }: commentProps) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-slate-700 text-sm">
          {comment.student.username}
        </span>
        <span className="text-slate-400 text-xs">
          {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
        </span>
      </div>
      <p className="text-slate-600 text-sm">{comment.text}</p>
    </div>
  );
}
