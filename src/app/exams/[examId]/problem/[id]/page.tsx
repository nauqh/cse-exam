import { getExamProblemQuestions } from "@/lib/questions";
import ProblemClient from "./ProblemClient";

export default async function ProblemPage({
	params,
}: {
	params: Promise<{ examId: string; id: string }>;
}) {
	const { examId, id } = await params;
	const problems = await getExamProblemQuestions(examId);

	if (problems.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				No problems found
			</div>
		);
	}

	return (
		<ProblemClient
			problems={problems}
			examId={examId}
			initialProblemId={parseInt(id)}
		/>
	);
}
