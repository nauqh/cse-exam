"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { BiHelpCircle, BiCodeAlt, BiMessageRoundedDots } from "react-icons/bi";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import ProblemDescription from "@/components/problem/ProblemDescription";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Question } from "@/lib/questions";
import CodeOutput from "@/components/CodeOutput";

type OutputType = {
	output: Record<string, string>[] | string;
	language: string;
};

export default function ProblemClient({
	problems,
	examId,
	initialProblemId,
}: {
	problems: Question[];
	examId: string;
	initialProblemId: number;
}) {
	const { toast } = useToast();
	const router = useRouter();
	const [code, setCode] = useState<string>("");
	const [output, setOutput] = useState<OutputType>({
		output: "",
		language: "",
	});
	const [language, setLanguage] = useState("sql");
	const [currentPage, setCurrentPage] = useState(initialProblemId);
	const [answeredProblems, setAnsweredProblems] = useState<{
		[problemId: number]: { code: string; language: string };
	}>({});
	const [showSummary, setShowSummary] = useState(false);

	useEffect(() => {
		const savedAnswers = localStorage.getItem("problemAnswers");
		if (savedAnswers) {
			setAnsweredProblems(JSON.parse(savedAnswers));
		}
	}, []);

	useEffect(() => {
		if (currentPage > problems.length || currentPage < 1) {
			router.push(`/exams/${examId}/problem/1`);
		}
	}, [currentPage, problems.length, examId, router]);

	useEffect(() => {
		if (answeredProblems[currentPage]) {
			setCode(answeredProblems[currentPage].code);
			setLanguage(answeredProblems[currentPage].language);
		} else {
			setCode("");
		}
	}, [currentPage, answeredProblems]);

	const currentProblem = problems[currentPage - 1];

	const handlePageChange = (page: number) => {
		router.push(`/exams/${examId}/problem/${page}`);
		setCurrentPage(page);
	};

	const handleCodeChange = useCallback((value: string) => {
		setCode(value);
	}, []);

	const handleRunCode = useCallback(async () => {
		try {
			setOutput({ output: "Executing...", language });
			const response = await fetch(
				"https://cspyclient.up.railway.app/execute",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						code: code,
						language: language,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				setOutput({ output: `Error: ${errorData.detail}`, language });
				return;
			}

			const data = await response.json();
			setOutput({ output: data.output, language });
		} catch (error) {
			setOutput({
				output: "Error connecting to the server. Please try again.",
				language,
			});
		}
	}, [code, language]);

	const handleSubmit = () => {
		if (!code) {
			toast({
				description: "Please write some code before submitting",
				className: "bg-yellow-100 text-yellow-900",
				duration: 3000,
			});
			return;
		}

		const newAnswers = {
			...answeredProblems,
			[currentPage]: { code, language },
		};

		setAnsweredProblems(newAnswers);
		localStorage.setItem("problemAnswers", JSON.stringify(newAnswers));

		if (currentPage < problems.length) {
			handlePageChange(currentPage + 1);
		}
	};

	const handleReset = () => {
		const newAnswers = { ...answeredProblems };
		delete newAnswers[currentPage];
		setAnsweredProblems(newAnswers);
		setCode("");
		setOutput({ output: "", language });
		localStorage.setItem("problemAnswers", JSON.stringify(newAnswers));
	};

	const handleFinishSection = () => {
		router.push(`/exams/${examId}/final`);
	};

	// Add keybinding: Ctrl+Enter to run code
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "Enter") {
				event.preventDefault();
				handleRunCode();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleRunCode]);

	return (
		<div className="p-6 h-[100vh] w-[90vw]">
			<ResizablePanelGroup direction="horizontal">
				{/* Problem description panel */}
				<ResizablePanel defaultSize={50} minSize={30}>
					<div className="h-full flex flex-col border rounded-sm justify-between">
						<Tabs
							defaultValue="description"
							className="overflow-auto"
						>
							<TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-none">
								<TabsTrigger
									value="description"
									className="hover:bg-gray-100 flex items-center gap-2"
								>
									<BiHelpCircle className="w-4 h-4" />
									Description
								</TabsTrigger>
								<TabsTrigger
									value="solutions"
									className="hover:bg-gray-100 flex items-center gap-2"
								>
									<BiCodeAlt className="w-4 h-4" />
									Solutions
								</TabsTrigger>
								<TabsTrigger
									value="discussion"
									className="hover:bg-gray-100 flex items-center gap-2"
								>
									<BiMessageRoundedDots className="w-4 h-4" />
									Discussion
								</TabsTrigger>
							</TabsList>
							<ProblemDescription
								name="description"
								content={currentProblem?.question}
								questionNumber={currentPage}
							/>
							<ProblemDescription name="solutions" />
							<ProblemDescription name="discussion" />
						</Tabs>
						<div className="flex items-center justify-center gap-2 p-2 border-b">
							{Array.from(
								{ length: problems.length },
								(_, i) => i + 1
							).map((page) => (
								<button
									key={page}
									onClick={() => handlePageChange(page)}
									className={`
                                        w-8 h-8 rounded-sm flex items-center justify-center relative
                                        ${
											currentPage === page
												? "bg-primary text-primary-foreground"
												: "hover:bg-muted"
										}
                                        ${
											answeredProblems[page]
												? 'after:content-["●"] after:absolute after:text-[8px] after:text-green-500 after:top-0 after:right-1'
												: ""
										}
                                    `}
								>
									{page}
								</button>
							))}
						</div>
					</div>
				</ResizablePanel>

				<ResizableHandle className="w-1 bg-gray-50 hover:bg-gray-100 cursor-col-resize" />

				{/* Code editor and output panel */}
				<ResizablePanel defaultSize={50} minSize={30}>
					<ResizablePanelGroup
						direction="vertical"
						className="h-full flex flex-col border rounded-sm"
					>
						{/* Code editor panel */}
						<ResizablePanel
							defaultSize={65}
							minSize={10}
							className="flex-1 overflow-hidden flex flex-col"
						>
							<div className="flex items-center justify-between p-2 border-b">
								<div className="flex items-center gap-4">
									<h1 className="text-lg font-semibold">
										Input
									</h1>
									<span className="text-xs text-gray-500 bg-gray-100 p-2 rounded-md">
										Ctrl+Enter to run code
									</span>
								</div>
								<Select
									value={language}
									onValueChange={(value) => {
										setLanguage(value);
										setCode("");
									}}
								>
									<SelectTrigger className="w-32 focus:ring-0 focus:ring-offset-0">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="python">
											Python
										</SelectItem>
										<SelectItem value="sql">SQL</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<CodeMirror
								value={code}
								height="100%"
								onChange={handleCodeChange}
								className="h-full 2xl:text-xl"
							/>
						</ResizablePanel>

						<ResizableHandle className="w-1 bg-gray-50 hover:bg-gray-100 cursor-col-resize" />

						{/* Output panel */}
						<ResizablePanel
							defaultSize={35}
							minSize={35}
							className="h-52 p-4 border-t flex flex-col"
						>
							<div className="text-lg mb-2 font-semibold">
								Output
							</div>

							<CodeOutput data={output.output} />

							{/* Action buttons */}
							<div className="flex gap-4 justify-end mt-auto pt-2">
								<Button variant="outline" onClick={handleReset}>
									Reset
								</Button>
								<Button
									variant="outline"
									onClick={handleRunCode}
								>
									Run Code
								</Button>
								<Button onClick={handleSubmit}>Submit</Button>
								{Object.keys(answeredProblems).length ===
									problems.length && (
									<Button
										onClick={() => setShowSummary(true)}
										variant="success"
									>
										Review
									</Button>
								)}
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>

			{/* Summary overlay */}
			{showSummary && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowSummary(false);
						}
					}}
				>
					<div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
						<h2 className="text-2xl font-bold mb-4">
							Answer Summary
						</h2>
						<div className="space-y-4">
							{problems.map((problem, index) => (
								<div key={index + 1} className="border-b pb-2">
									<p className="font-semibold">
										Problem {index + 1}:
									</p>
									<p className="text-gray-600">
										Language:{" "}
										{answeredProblems[index + 1]
											?.language || "Not answered"}
									</p>
									<pre className="bg-gray-50 p-2 mt-1 rounded">
										{answeredProblems[index + 1]?.code ||
											"No code submitted"}
									</pre>
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
								variant="success"
							>
								Finish Problem Section
							</Button>
						</div>
					</div>
				</div>
			)}
			<Toaster />
		</div>
	);
}
