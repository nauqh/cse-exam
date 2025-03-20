"use client";
import React, { useState, useEffect } from "react";
import ZoomableImage from "@/components/ZoomableImage";
import ReactMarkdown from "react-markdown";
import { ExamContent } from "@/lib/questions";
import { cn } from "@/lib/utils";
import TableDisplay from "@/components/problem/TableDisplay";
import { FileData, LinkData } from "@/types/exam";

type SubmissionAnswer = {
	answer: string;
	type: "multichoice" | "sql" | "python" | "pandas" | "file";
	status?: "correct" | "incorrect" | "partial" | "not_submitted";
	files?: FileData[];
	links?: LinkData[];
};

export type Submission = {
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

// Function to parse the exam summary markdown string and extract question correctness
const parseExamSummary = (
	summaryMarkdown: string
): {
	questionId: string;
	status: "correct" | "incorrect" | "partial" | "not_submitted";
}[] => {
	const results: {
		questionId: string;
		status: "correct" | "incorrect" | "partial" | "not_submitted";
	}[] = [];

	// Extract sections for correct, partial, incorrect and not submitted
	const correctMatch = summaryMarkdown.match(
		/Correct:[\s\S]*?(Partial:|Incorrect:|Not submitted:|Issue:|FINAL SCORE:)/
	);
	const partialMatch = summaryMarkdown.match(
		/Partial:[\s\S]*?(Correct:|Incorrect:|Not submitted:|Issue:|FINAL SCORE:)/
	);
	const incorrectMatch = summaryMarkdown.match(
		/Incorrect:[\s\S]*?(Correct:|Partial:|Not submitted:|Issue:|FINAL SCORE:)/
	);
	const notSubmittedMatch = summaryMarkdown.match(
		/Not submitted:[\s\S]*?(Correct:|Partial:|Incorrect:|Issue:|FINAL SCORE:)/
	);

	// Helper function to extract question IDs from a section
	const extractQuestionIds = (sectionText: string | null): string[] => {
		if (!sectionText) return [];

		// Match all question IDs in the format "Q1", "Q2", etc.
		const matches = sectionText.matchAll(/- Q(\d+)/g);
		return Array.from(matches).map((match) => match[1]);
	};

	// Process correct questions
	const correctQuestions = extractQuestionIds(correctMatch?.[0] || null);
	correctQuestions.forEach((qId) => {
		results.push({ questionId: qId, status: "correct" });
	});

	// Process partially correct questions
	const partialQuestions = extractQuestionIds(partialMatch?.[0] || null);
	partialQuestions.forEach((qId) => {
		results.push({ questionId: qId, status: "partial" });
	});

	// Process incorrect questions
	const incorrectQuestions = extractQuestionIds(incorrectMatch?.[0] || null);
	incorrectQuestions.forEach((qId) => {
		results.push({ questionId: qId, status: "incorrect" });
	});

	// Process not submitted questions
	const notSubmittedQuestions = extractQuestionIds(
		notSubmittedMatch?.[0] || null
	);
	notSubmittedQuestions.forEach((qId) => {
		results.push({ questionId: qId, status: "not_submitted" });
	});

	// Sort results by question ID (numerically)
	results.sort((a, b) => parseInt(a.questionId) - parseInt(b.questionId));

	return results;
};

export default function ReviewClient({
	data,
	submission,
}: {
	data: ExamContent;
	submission: Submission;
}) {
	const [processedSubmission, setProcessedSubmission] =
		useState<Submission | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			// Process the submission to add status to each answer
			const questionResults = parseExamSummary(submission.summary);

			// Map the answers with the correct status value based on questionId
			const processedAnswers = submission.answers.map(
				(answer: SubmissionAnswer, index: number) => {
					// Question IDs are 1-indexed, so add 1 to the index
					const questionId = (index + 1).toString();
					const result = questionResults.find(
						(q) => q.questionId === questionId
					);

					return {
						...answer,
						status: result ? result.status : "not_submitted",
					};
				}
			);

			const updatedSubmission = {
				...submission,
				answers: processedAnswers,
			};

			setProcessedSubmission(updatedSubmission);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Error processing submission data"
			);
		} finally {
			setLoading(false);
		}
	}, [submission]);

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
			<div className="bg-white rounded-lg py-6 mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h1 className="text-2xl font-bold">Exam Review</h1>
					{processedSubmission && (
						<div className="flex gap-6 text-sm">
							<div className="flex flex-col">
								<span className="text-muted-foreground">
									Score
								</span>
								<span className="font-semibold">
									{processedSubmission.score}/100
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-muted-foreground">
									Submitted
								</span>
								<span className="font-semibold">
									{new Date(
										processedSubmission.submitted_at
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
					const submissionAnswer =
						processedSubmission?.answers[index];
					const status = submissionAnswer?.status;

					return (
						<div
							key={index}
							className={cn(
								"border rounded-lg p-4 md:p-6 bg-white",
								status === "correct"
									? "border-green-200"
									: status === "incorrect"
									? "border-red-200"
									: "border-gray-200"
							)}
						>
							<div className="flex items-center gap-3 mb-4">
								<h2 className="text-lg font-semibold">
									Question {questionNumber}
								</h2>
								<span
									className={cn(
										"text-sm px-2 py-1 rounded-full",
										status === "correct"
											? "bg-green-100 text-green-700"
											: status === "incorrect"
											? "bg-red-100 text-red-700"
											: "bg-gray-100 text-gray-700"
									)}
								>
									{status === "correct"
										? "+10 points"
										: status === "incorrect"
										? "0 points"
										: "Not submitted"}
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
										status === "correct"
											? "bg-green-50"
											: status === "incorrect"
											? "bg-red-50"
											: "bg-gray-50"
									)}
								>
									<p
										className={cn(
											"font-medium mb-2",
											status === "correct"
												? "text-green-700"
												: status === "incorrect"
												? "text-red-700"
												: "text-gray-700"
										)}
									>
										{status === "correct"
											? "✓ Correct"
											: status === "incorrect"
											? "✗ Incorrect"
											: "Not submitted"}
									</p>

									{/* Multiple Choice Answer */}
									{question.choices &&
										submissionAnswer?.type ===
											"multichoice" && (
											<div className="mt-2">
												<p
													className={cn(
														"text-sm",
														status === "correct"
															? "text-green-600"
															: status ===
															  "incorrect"
															? "text-red-600"
															: "text-gray-600"
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
													status === "correct"
														? "text-green-600"
														: status === "incorrect"
														? "text-red-600"
														: "text-gray-600"
												)}
											>
												Your{" "}
												{submissionAnswer.type.toUpperCase()}{" "}
												solution:
											</p>
											<pre
												className={cn(
													"p-3 rounded-lg overflow-x-auto text-sm font-mono",
													status === "correct"
														? "bg-green-100 border border-green-200"
														: status === "incorrect"
														? "bg-red-100 border border-red-200"
														: "bg-gray-100 border border-gray-200"
												)}
											>
												<code>
													{submissionAnswer.answer}
												</code>
											</pre>
										</div>
									)}

									{/* File Upload Answer */}
									{submissionAnswer?.type === "file" && (
										<div className="mt-2">
											<p
												className={cn(
													"text-sm mb-2",
													status === "correct"
														? "text-green-600"
														: status === "incorrect"
														? "text-red-600"
														: "text-gray-600"
												)}
											>
												Your uploaded files:
											</p>
											<div
												className={cn(
													"p-3 rounded-lg",
													status === "correct"
														? "bg-green-100 border border-green-200"
														: status === "incorrect"
														? "bg-red-100 border border-red-200"
														: "bg-gray-100 border border-gray-200"
												)}
											>
												{submissionAnswer.files
													?.length ? (
													<ul className="space-y-1">
														{submissionAnswer.files.map(
															(file, idx) => (
																<li
																	key={idx}
																	className="text-sm"
																>
																	{file.name}{" "}
																	<span className="text-xs text-gray-500">
																		(
																		{(
																			file.size /
																			1024
																		).toFixed(
																			1
																		)}{" "}
																		KB)
																	</span>
																</li>
															)
														)}
													</ul>
												) : (
													<p className="text-sm text-gray-500">
														No files submitted
													</p>
												)}
											</div>
										</div>
									)}

									{/* Link Answer */}
									{submissionAnswer?.links &&
										submissionAnswer.links.length > 0 && (
											<div className="mt-2">
												<p
													className={cn(
														"text-sm mb-2",
														status === "correct"
															? "text-green-600"
															: status ===
															  "incorrect"
															? "text-red-600"
															: "text-gray-600"
													)}
												>
													Your submitted links:
												</p>
												<div
													className={cn(
														"p-3 rounded-lg",
														status === "correct"
															? "bg-green-100 border border-green-200"
															: status ===
															  "incorrect"
															? "bg-red-100 border border-red-200"
															: "bg-gray-100 border border-gray-200"
													)}
												>
													<ul className="space-y-1">
														{submissionAnswer.links.map(
															(link, idx) => (
																<li
																	key={idx}
																	className="text-sm"
																>
																	<a
																		href={
																			link.url
																		}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-blue-600 hover:underline"
																	>
																		{link.description ||
																			link.url}
																	</a>
																</li>
															)
														)}
													</ul>
												</div>
											</div>
										)}

									{status === "incorrect" && (
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
