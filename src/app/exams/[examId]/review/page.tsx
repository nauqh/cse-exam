import ReviewClient from "./ReviewClient";
import { getExamQuestions } from "@/lib/questions";

export default async function ReviewPage({
	params,
}: {
	params: { examId: string };
}) {
	const { examId } = params;
	const data = await getExamQuestions(examId);

	if (data.content.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				No questions found
			</div>
		);
	}

	return <ReviewClient data={data} examId={examId} />;
}
