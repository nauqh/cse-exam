import ReviewClient from "./ReviewClient";
import { getExamQuestions, getExamProblemQuestions } from "@/lib/questions";

export default async function ReviewPage({
	params,
}: {
	params: Promise<{ examId: string }>;
}) {
	const { examId } = await params;
	const [multichoiceData, problemData] = await Promise.all([
		getExamQuestions(examId),
		getExamProblemQuestions(examId),
	]);

	const combinedData = {
		name: multichoiceData.name,
		language: multichoiceData.language,
		content: [...multichoiceData.content, ...problemData.content],
	};

	if (combinedData.content.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				No questions found
			</div>
		);
	}

	return <ReviewClient data={combinedData} examId={examId} />;
}
