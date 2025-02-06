"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import ZoomableImage from "@/components/ZoomableImage";

import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/questions";
import { cn } from "@/lib/utils";

const processMarkdown = (content: string) => {
	const processedContent = content.replace(/<br\/>/g, "\n\n");
	return processedContent.split(/(```[^`]*```)/g);
};

export default function MultiChoiceClient({
	questions,
	examId,
	initialQuestionId,
}: {
	questions: Question[];
	examId: string;
	initialQuestionId: number;
}) {
	const router = useRouter();
	const [id, setId] = useState(initialQuestionId);
	const [selectedOption, setSelectedOption] = useState<string>("");
	const [answeredQuestions, setAnsweredQuestions] = useState<{
		[questionId: number]: string;
	}>({});
	const [showSummary, setShowSummary] = useState(false);

	const currentQuestion = questions[id - 1];
	const totalQuestions = questions.length;
	const { toast, dismiss } = useToast();

	useEffect(() => {
		const savedAnswers = localStorage.getItem("multichoiceAnswers");
		if (savedAnswers) {
			setAnsweredQuestions(JSON.parse(savedAnswers));
		}
	}, []);

	useEffect(() => {
		if (answeredQuestions[id]) {
			setSelectedOption(answeredQuestions[id]);
		} else {
			setSelectedOption("");
		}
	}, [id, answeredQuestions]);

	useEffect(() => {
		if (id > questions.length || id < 1) {
			router.push(`/exams/${examId}/multichoice/1`);
		}
	}, [id, questions.length, examId, router]);

	const handleSubmit = () => {
		if (!selectedOption) {
			toast({
				description: "Please choose an option",
				className: "bg-yellow-100 text-yellow-900",
				duration: 3000,
			});
			return;
		}

		const newAnswers = {
			...answeredQuestions,
			[id]: selectedOption,
		};

		setAnsweredQuestions(newAnswers);
		localStorage.setItem("multichoiceAnswers", JSON.stringify(newAnswers));

		if (id < questions.length) {
			router.push(`/exams/${examId}/multichoice/${id + 1}`);
		}
	};

	const handleReset = () => {
		const newAnswers = { ...answeredQuestions };
		delete newAnswers[id];
		setAnsweredQuestions(newAnswers);
		setSelectedOption("");
		localStorage.setItem("multichoiceAnswers", JSON.stringify(newAnswers));
	};

	const handlePageChange = (pageNumber: number) => {
		router.push(`/exams/${examId}/multichoice/${pageNumber}`);
	};

	const handleShowSummary = () => {
		setShowSummary(true);
	};

	const handleFinishSection = () => {
		toast({
			title: "Warning",
			description:
				"Once you proceed, you won't be able to return and edit your answers in this section. Do you want to continue?",
			className: "bg-yellow-100 text-yellow-900",
			action: (
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => router.push(`/exams/${examId}/problem`)}
					>
						Yes
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setShowSummary(false);
							dismiss();
						}}
					>
						No
					</Button>
				</div>
			),
			duration: 0,
		});
	};

	const parts = processMarkdown(currentQuestion.question);

	return (
		<>
			{currentQuestion ? (
				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-9 grid grid-rows-[auto_1fr] gap-4">
						<div className="bg-white rounded-lg h-[400px] overflow-y-auto">
							<h2 className="text-xl font-semibold mb-2">
								Question {id}
							</h2>
							<div className="prose dark:prose-invert pr-2">
								{parts.map((part, index) => {
									if (!part.startsWith("```")) {
										return (
											<ReactMarkdown
												key={index}
												className="my-2"
												components={{
													strong: ({ children }) => (
														<span className="font-bold text-primary">
															{children}
														</span>
													),
													blockquote: ({
														children,
													}) => (
														<blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">
															{children}
														</blockquote>
													),
													code: ({ children }) => (
														<code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm">
															{children}
														</code>
													),
													img: ({ src }) =>
														src && (
															<ZoomableImage
																src={src}
															/>
														),
													em: ({ children }) => (
														<em className="not-italic my-2">
															{children}
														</em>
													),
													ul: ({ children }) => (
														<ul className="list-disc pl-6 space-y-2 my-2">
															{children}
														</ul>
													),
												}}
											>
												{part}
											</ReactMarkdown>
										);
									} else {
										return (
											<pre
												key={index}
												className={cn(
													"bg-zinc-950 text-zinc-50 p-4 rounded-lg my-4",
													"font-mono text-sm overflow-x-auto",
													"border border-border"
												)}
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
							</div>
						</div>

						<div className="bg-white rounded-lg p-4 overflow-y-auto">
							<RadioGroup
								value={selectedOption}
								onValueChange={setSelectedOption}
							>
								{currentQuestion.choices.map((choice) => (
									<div
										key={choice}
										className="flex items-center space-x-2"
									>
										<RadioGroupItem
											value={choice}
											id={choice}
										/>
										<Label
											htmlFor={choice}
											className="text-base"
										>
											<ReactMarkdown>
												{choice}
											</ReactMarkdown>
										</Label>
									</div>
								))}
							</RadioGroup>
						</div>
					</div>

					<div className="col-span-3 bg-white rounded-lg p-4 flex flex-col gap-4">
						<div className="p-2 bg-muted rounded-sm text-center">
							<p className="text-sm text-muted-foreground">
								Question {id} of {totalQuestions} <br />(
								{Object.keys(answeredQuestions).length}{" "}
								answered)
							</p>
						</div>

						<div className="flex-1 overflow-y-auto">
							<div className="grid grid-cols-3 gap-2">
								{Array.from(
									{ length: totalQuestions },
									(_, i) => i + 1
								).map((pageNumber) => (
									<div
										key={pageNumber}
										onClick={() =>
											handlePageChange(pageNumber)
										}
										className={`
                      relative p-2 rounded text-center cursor-pointer
                      ${
							pageNumber === id
								? "bg-primary text-primary-foreground"
								: "hover:bg-muted"
						}
                      ${
							answeredQuestions[pageNumber]
								? 'after:content-["●"] after:absolute after:text-[8px] after:text-green-500 after:top-0 after:right-1'
								: ""
						}
                    `}
									>
										{pageNumber}
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Button
								variant="outline"
								onClick={handleReset}
								className="w-full"
							>
								Reset
							</Button>
							<Button onClick={handleSubmit} className="w-full">
								Save
							</Button>
							{Object.keys(answeredQuestions).length ===
								questions.length && (
								<Button
									onClick={handleShowSummary}
									className="w-full bg-green-600 hover:bg-green-700"
								>
									Review
								</Button>
							)}
						</div>
					</div>

					{showSummary && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
								<h2 className="text-2xl font-bold mb-4">
									Answer Summary
								</h2>
								<div className="space-y-4">
									{questions.map((question, index) => (
										<div
											key={index + 1}
											className="border-b pb-2"
										>
											<p className="font-semibold">
												Question {index + 1}:
											</p>
											<p className="text-gray-600">
												Selected:{" "}
												{answeredQuestions[index + 1] ||
													"Not answered"}
											</p>
										</div>
									))}
								</div>
								<div className="flex gap-2 mt-4">
									<Button
										variant="outline"
										onClick={() => setShowSummary(false)}
									>
										Close
									</Button>
									<Button
										onClick={handleFinishSection}
										className="bg-green-600 hover:bg-green-700"
									>
										Finish multiple choices section
									</Button>
								</div>
							</div>
						</div>
					)}

					<Toaster />
				</div>
			) : (
				<div className="flex justify-center items-center h-screen">
					Question not found
				</div>
			)}
		</>
	);
}
