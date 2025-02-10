import { Button } from "@/components/ui/button";
import Link from "next/link";

export type SubmissionStatus =
	| "completed"
	| "incompleted"
	| "failed"
	| "marking";

export interface ExamSubmission {
	email: string;
	exam_id: string;
	exam_name: string;
	submitted_at: string;
	summary: string;
	score: number;
	channel?: string;
	status: SubmissionStatus;
}

export function ExamCard({ exam }: { exam: ExamSubmission }) {
	return (
		<div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
			<div className="space-y-1">
				<h3 className="font-medium">{exam.exam_name}</h3>
				<p className="text-sm text-muted-foreground">
					Taken on:{" "}
					{new Date(exam.submitted_at).toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</p>
			</div>
			<div className="flex items-center gap-4">
				<div
					className={`px-3 py-1 rounded-full text-sm ${
						exam.status === "completed"
							? "bg-green-100 text-green-800"
							: exam.status === "failed"
							? "bg-red-100 text-red-800"
							: exam.status === "incompleted"
							? "bg-gray-100 text-gray-800"
							: "bg-yellow-100 text-yellow-800"
					}`}
				>
					{exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
					{exam.score !== undefined && ` (${exam.score.toFixed(1)}%)`}
				</div>
				<Link href={`/exams/${exam.exam_id}`}>
					<Button variant="outline">
						{exam.status === "failed" ? "Retry" : "View"}
					</Button>
				</Link>
			</div>
		</div>
	);
}
