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

const processMarkdown = (content: string) => {
	const processedContent = content.replace(/<br\/>/g, "\n");
	return processedContent.replace(/<img[^>]*>/g, "");
};

interface MultiChoiceClientProps {
	questions: Question[];
	examId: string;
	initialQuestionId: number;
}

export default function MultiChoiceClient({
	questions,
	examId,
	initialQuestionId,
}: MultiChoiceClientProps) {
	const router = useRouter();
	const [id, setId] = useState(initialQuestionId);
	const [selectedOption, setSelectedOption] = useState<string>("");
	const [answeredQuestions, setAnsweredQuestions] = useState<{
		[questionId: number]: string;
	}>({});

	const currentQuestion = questions[id - 1];
	const totalQuestions = questions.length;
	const { toast } = useToast();

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

	const handleSubmission = () => {
		const answers = localStorage.getItem("multichoiceAnswers");
		if (answers) {
			toast({
				description: JSON.stringify(JSON.parse(answers), null, 2),
				className: "bg-blue-100 text-blue-900",
				duration: 5000,
			});
		} else {
			toast({
				description: "No answers found",
				className: "bg-yellow-100 text-yellow-900",
				duration: 3000,
			});
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

	return (
		<>
			{currentQuestion ? (
				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-9 grid grid-rows-[auto_1fr] gap-4">
						<div className="bg-white rounded-lg h-[400px] overflow-y-auto">
							<h2 className="text-xl font-semibold mb-2">
								Question {id}
							</h2>
							<div className="text-gray-700">
								<ReactMarkdown>
									{processMarkdown(currentQuestion.question)}
								</ReactMarkdown>
								{currentQuestion.img && (
									<div className="my-4">
										<ZoomableImage
											src={currentQuestion.img}
										/>
									</div>
								)}
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
								Save Answer
							</Button>
						</div>
						<Button onClick={handleSubmission} className="w-full">
							Test get submission
						</Button>
					</div>
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
