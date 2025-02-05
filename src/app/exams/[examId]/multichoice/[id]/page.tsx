import { getExamQuestions } from "@/lib/questions";
import MultiChoiceClient from "./MultiChoiceClient";

export default async function MultiChoicePage({
	params,
}: {
	params: Promise<{ examId: string; id: string }>;
}) {
	const { examId, id } = await params;

	const questions = await getExamQuestions(examId);

	if (questions.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				No questions found
			</div>
		);
	}

	return (
		<MultiChoiceClient
			questions={questions}
			examId={examId}
			initialQuestionId={parseInt(id)}
		/>
	);
}
