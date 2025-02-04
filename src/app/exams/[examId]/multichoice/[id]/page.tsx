"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ZoomableImage from "@/components/ZoomableImage";
import { usePathname, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { getExamQuestions, Question } from "@/lib/questions";

const processMarkdown = (content: string) => {
	const processedContent = content.replace(/<br\/>/g, "\n\n");
	return processedContent.replace(/<img[^>]*>/g, "");
};

export default function MultiChoicePage() {
	const router = useRouter();
	const pathname = usePathname();
	const id = parseInt(pathname.split("/").pop() || "1");
	const examId = pathname.split("/")[2];
	const [selectedOption, setSelectedOption] = useState<string>("");
	const [answeredQuestions, setAnsweredQuestions] = useState<{
		[questionId: number]: string;
	}>({});
	const [questions, setQuestions] = useState<Question[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Load questions data
	useEffect(() => {
		const loadQuestions = async () => {
			try {
				const multichoiceQuestions = await getExamQuestions(examId);
				if (multichoiceQuestions.length === 0) {
					router.push("/exams");
					return;
				}
				setQuestions(multichoiceQuestions);
			} finally {
				setIsLoading(false);
			}
		};

		loadQuestions();
	}, [examId, router]);

	const currentQuestion = questions[id - 1];
	const totalQuestions = questions.length;

	const { toast } = useToast();

	// Update the redirect effect to only run after questions are loaded
	useEffect(() => {
		if (!isLoading && questions.length > 0) {
			if (id > questions.length || id < 1) {
				router.push(`/exams/${examId}/multichoice/1`);
			}
		}
	}, [id, questions, isLoading, examId, router]);

	// Load answers from localStorage on mount
	useEffect(() => {
		const savedAnswers = localStorage.getItem("multichoiceAnswers");
		if (savedAnswers) {
			setAnsweredQuestions(JSON.parse(savedAnswers));
		}
	}, []);

	// Load previous answer for current question if it exists
	useEffect(() => {
		if (answeredQuestions[id]) {
			setSelectedOption(answeredQuestions[id]);
		} else {
			setSelectedOption("");
		}
	}, [id, answeredQuestions]);

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

		// Update the navigation logic
		if (!isLoading && questions.length > 0 && id < questions.length) {
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

	// Format time function
	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading questions...
			</div>
		);
	}

	return (
		<>
			{currentQuestion ? (
				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-9 grid grid-rows-[auto_1fr] gap-4">
						{/* Question area with fixed height */}
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

						{/* Choices area with remaining height */}
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

					{/* Sidebar - 3 columns */}
					<div className="col-span-3 bg-white rounded-lg p-4 flex flex-col gap-4">
						{/* Progress indicator */}
						<div className="p-2 bg-muted rounded-sm text-center">
							<p className="text-sm text-muted-foreground">
								Question {id} of {totalQuestions} <br />(
								{Object.keys(answeredQuestions).length}{" "}
								answered)
							</p>
						</div>

						{/* Vertical pagination */}
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
											${pageNumber === id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
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

						{/* Action buttons */}
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
