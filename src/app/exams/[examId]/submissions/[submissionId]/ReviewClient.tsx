"use client";
import React, { useState, useEffect } from "react";
import ZoomableImage from "@/components/ZoomableImage";
import ReactMarkdown from "react-markdown";
import { ExamContent } from "@/lib/questions";
import { cn } from "@/lib/utils";
import TableDisplay from "@/components/problem/TableDisplay";

type SubmissionAnswer = {
	answer: string;
	type: "multichoice" | "sql" | "python" | "pandas";
	isCorrect?: boolean;
};

type Submission = {
	email: string;
	answers: SubmissionAnswer[];
	exam_id: string;
	exam_name: string;
	submitted_at: string;
	summary: string;
	score: number;
	status: string;
};

const processMarkdown = (content: string) => {
	const processedContent = content.replace(/<br\/>/g, "\n\n");
	return processedContent.split(/(```[^`]*```)/g);
};

export default function ReviewClient({
	data,
	submissionId,
}: {
	data: ExamContent;
	submissionId: number;
}) {
	const [submission, setSubmission] = useState<Submission | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSubmission = async () => {
			try {
				const response = await fetch(
					`https://cspyclient.up.railway.app/submissions/${submissionId}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch submission");
				}

				const data = await response.json();
				data.answers = data.answers.map((answer: SubmissionAnswer) => ({
					...answer,
					isCorrect: Math.random() > 0.5,
				}));
				setSubmission(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Something went wrong"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchSubmission();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading submission data...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500">
				{error}
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-4 md:p-6">
			<div className="bg-white rounded-lg p-6 mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h1 className="text-2xl font-bold">Exam Review</h1>
					{submission && (
						<div className="flex gap-6 text-sm">
							<div className="flex flex-col">
								<span className="text-muted-foreground">
									Score
								</span>
								<span className="font-semibold">
									{submission.score}/100
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-muted-foreground">
									Submitted
								</span>
								<span className="font-semibold">
									{new Date(
										submission.submitted_at
									).toLocaleString("en-US", {
										day: "2-digit",
										month: "short",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="space-y-6">
				{data.content.map((question, index) => {
					const questionNumber = index + 1;
					const parts = processMarkdown(question.question);
					const submissionAnswer = submission?.answers[index];
					const isCorrect = submissionAnswer?.isCorrect;

					return (
						<div
							key={index}
							className={cn(
								"border rounded-lg p-4 md:p-6 bg-white",
								isCorrect
									? "border-green-200"
									: "border-red-200"
							)}
						>
							<div className="flex items-center gap-3 mb-4">
								<h2 className="text-lg font-semibold">
									Question {questionNumber}
								</h2>
								<span
									className={cn(
										"text-sm px-2 py-1 rounded-full",
										isCorrect
											? "bg-green-100 text-green-700"
											: "bg-red-100 text-red-700"
									)}
								>
									{isCorrect ? "+10 points" : "0 points"}
								</span>
							</div>

							<div className="prose dark:prose-invert max-w-none mb-6">
								{parts.map((part, idx) => {
									if (!part.startsWith("```")) {
										return (
											<ReactMarkdown
												key={idx}
												components={{
													img: ({ src }) =>
														src && (
															<ZoomableImage
																src={src}
															/>
														),
													code: ({ children }) => (
														<code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm">
															{children}
														</code>
													),
												}}
											>
												{part}
											</ReactMarkdown>
										);
									} else {
										return (
											<pre
												key={idx}
												className="bg-zinc-950 text-zinc-50 p-4 rounded-lg my-4"
											>
												<code>
													{part
														.replace(/```/g, "")
														.replace("...", "")
														.trim()}
												</code>
											</pre>
										);
									}
								})}
								{question.tableData && (
									<TableDisplay
										tableData={question.tableData}
									/>
								)}
							</div>

							{/* Unified Answer Display Section */}
							<div className="mt-4">
								<div
									className={cn(
										"p-4 rounded-lg",
										isCorrect ? "bg-green-50" : "bg-red-50"
									)}
								>
									<p
										className={cn(
											"font-medium mb-2",
											isCorrect
												? "text-green-700"
												: "text-red-700"
										)}
									>
										{isCorrect
											? "✓ Correct Answer"
											: "✗ Incorrect Answer"}
									</p>

									{/* Multiple Choice Answer */}
									{question.choices &&
										submissionAnswer?.type ===
											"multichoice" && (
											<div className="mt-2">
												<p
													className={cn(
														"text-sm",
														isCorrect
															? "text-green-600"
															: "text-red-600"
													)}
												>
													Your answer:{" "}
													{submissionAnswer.answer}
												</p>
											</div>
										)}

									{/* Code Answer */}
									{(submissionAnswer?.type === "sql" ||
										submissionAnswer?.type === "python" ||
										submissionAnswer?.type ===
											"pandas") && (
										<div className="mt-2">
											<p
												className={cn(
													"text-sm mb-2",
													isCorrect
														? "text-green-600"
														: "text-red-600"
												)}
											>
												Your{" "}
												{submissionAnswer.type.toUpperCase()}{" "}
												solution:
											</p>
											<pre
												className={cn(
													"p-3 rounded-lg overflow-x-auto text-sm font-mono",
													isCorrect
														? "bg-green-100 border border-green-200"
														: "bg-red-100 border border-red-200"
												)}
											>
												<code>
													{submissionAnswer.answer}
												</code>
											</pre>
										</div>
									)}

									{!isCorrect && (
										<p
											className={cn(
												"text-sm mt-3",
												"text-red-600"
											)}
										>
											{submissionAnswer?.type ===
											"multichoice"
												? "Please review the correct option for this question."
												: "Check your logic and try to identify any errors in your code."}
										</p>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
