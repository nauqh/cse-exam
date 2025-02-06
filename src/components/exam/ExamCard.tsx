import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface ExamHistory {
	id: string;
	title: string;
	date: string;
	status: "completed" | "failed" | "marking" | "incomplete";
	score?: number;
}

interface ExamCardProps {
	exam: ExamHistory;
}

export function ExamCard({ exam }: ExamCardProps) {
	return (
		<div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
			<div className="space-y-1">
				<h3 className="font-medium">{exam.title}</h3>
				<p className="text-sm text-muted-foreground">
					Taken on:{" "}
					{new Date(exam.date).toLocaleDateString("en-GB", {
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
							: exam.status === "incomplete"
							? "bg-gray-100 text-gray-800"
							: "bg-yellow-100 text-yellow-800"
					}`}
				>
					{exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
					{exam.score && ` (${exam.score}%)`}
				</div>
				<Link href={`/exams/${exam.id}`}>
					<Button variant="outline">
						{exam.status === "failed" ? "Retry" : "View"}
					</Button>
				</Link>
			</div>
		</div>
	);
}
