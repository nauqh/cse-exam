"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import SubmittingOverlay from "@/components/SubmittingOverlay";
import { ExamResults, MultiChoiceAnswer, ProblemAnswer } from "@/types/exam";
import ReactMarkdown from "react-markdown";

export default function FinalClient({ examId }: { examId: string }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [response, setResponse] = useState<any>(null);
	const { toast } = useToast();
	const router = useRouter();

	const multichoiceAnswers: MultiChoiceAnswer = JSON.parse(
		localStorage.getItem("multichoiceAnswers") || "{}"
	);
	const problemAnswers: Record<string, ProblemAnswer> = JSON.parse(
		localStorage.getItem("problemAnswers") || "{}"
	);

	const handleSubmit = async () => {
		setIsSubmitting(true);

		const examResults: ExamResults = {
			// TODO: get from auth
			email: "quan.do@gmail.com",
			exam_id: examId,
			exam_name: "SQL Exam",
			answers: [
				...Object.entries(multichoiceAnswers).map(([_, answer]) => ({
					answer,
					type: "multichoice",
				})),
				...Object.entries(problemAnswers).map(([_, answer]) => ({
					answer: answer.code,
					type: answer.language,
				})),
			],
		};

		try {
			console.log(JSON.stringify(examResults));
			const response = await fetch(
				"https://cspyclient.up.railway.app/something",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(examResults),
				}
			);

			const data = await response.json();
			setResponse(data);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			toast({
				description: "Your exam has been submitted successfully!",
				className: "bg-green-100 text-green-900",
				duration: 3000,
			});

			// localStorage.removeItem("multichoiceAnswers");
			// localStorage.removeItem("problemAnswers");

			// router.push(`/exams/${examId}/results`);
		} catch (error) {
			toast({
				description: "Failed to submit exam. Please try again.",
				className: "bg-red-100 text-red-900",
				duration: 3000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8">Final Review</h1>

			<div className="space-y-8">
				<section className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">
						Multiple Choice Answers
					</h2>
					<div className="grid gap-4">
						{Object.entries(multichoiceAnswers).map(
							([question, answer]) => (
								<div key={question} className="border-b pb-2">
									<p className="font-medium">
										Question {question}
									</p>
									<p className="text-gray-600">
										Selected Answer: {answer}
									</p>
								</div>
							)
						)}
					</div>
				</section>

				<section className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">
						Programming Problems
					</h2>
					<div className="space-y-4">
						{Object.entries(problemAnswers).map(
							([problem, data]) => (
								<div key={problem} className="border-b pb-4">
									<p className="font-medium">
										Problem {problem}
									</p>
									<p className="text-gray-600">
										Language: {data.language}
									</p>
									<pre className="bg-gray-50 p-3 rounded mt-2 overflow-x-auto">
										<code>{data.code}</code>
									</pre>
								</div>
							)
						)}
					</div>
				</section>

				<div className="flex gap-4 justify-end">
					<Button
						variant="outline"
						onClick={() => router.back()}
						disabled={isSubmitting}
					>
						Go Back
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="bg-green-600 hover:bg-green-700"
					>
						{isSubmitting ? "Submitting..." : "Submit Exam"}
					</Button>
				</div>
			</div>

			{response && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
						<h2 className="text-xl font-semibold mb-4">
							API Response
						</h2>
						<div className="relative">
							<pre className="bg-gray-50 p-4 rounded h-[400px] overflow-y-auto">
								<ReactMarkdown className="my-2">
									{response}
								</ReactMarkdown>
							</pre>
						</div>
						<Button
							onClick={() => setResponse(null)}
							className="mt-4"
						>
							Close
						</Button>
					</div>
				</div>
			)}

			{isSubmitting && <SubmittingOverlay />}
			<Toaster />
		</div>
	);
}
