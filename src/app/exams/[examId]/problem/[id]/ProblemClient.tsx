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
import Dataframe from "@/components/Dataframe";

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
	const [output, setOutput] = useState<{
		output: string | any;
		language: string;
	}>({
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

	const handleRunCode = async () => {
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
	};

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
		localStorage.setItem("problemAnswers", JSON.stringify(newAnswers));
	};

	const handleFinishSection = () => {
		const examResults = {
			multichoice: JSON.parse(
				localStorage.getItem("multichoiceAnswers") || "{}"
			),
			problems: JSON.parse(
				localStorage.getItem("problemAnswers") || "{}"
			),
		};

		toast({
			description: (
				<div className="max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono">
					{JSON.stringify(examResults, null, 2)}
				</div>
			),
			className: "bg-blue-100 text-blue-900",
			duration: 5000,
		});
	};

	return (
		<div className="p-2">
			<ResizablePanelGroup direction="horizontal">
				{/* Problem description pannel */}
				<ResizablePanel defaultSize={50} minSize={30}>
					<div className="h-full flex flex-col border rounded-sm">
						<div className="flex-1">
							<Tabs defaultValue="description">
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
								/>
								<ProblemDescription name="solutions" />
								<ProblemDescription name="discussion" />
							</Tabs>
						</div>
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

				{/* Code editor and output pannel */}
				<ResizablePanel defaultSize={50} minSize={30}>
					<ResizablePanelGroup
						direction="vertical"
						className="h-full flex flex-col border rounded-sm"
					>
						{/* Code editor pannel */}
						<ResizablePanel
							defaultSize={65}
							minSize={10}
							className="flex-1 overflow-hidden flex flex-col"
						>
							<div className="flex items-center justify-between p-2 border-b">
								<h1 className="text-lg font-semibold">Input</h1>
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
								className="h-full"
							/>
						</ResizablePanel>

						<ResizableHandle className="w-1 bg-gray-50 hover:bg-gray-100 cursor-col-resize" />

						{/* Output pannel */}
						<ResizablePanel
							defaultSize={35}
							minSize={35}
							className="h-52 p-4 border-t flex flex-col"
						>
							<div className="text-lg mb-2 font-semibold">
								Output
							</div>
							{output.language === "python" ? (
								<div className="min-h-[150px] h-fit overflow-auto bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex">
									{output.output}
								</div>
							) : (
								<Dataframe data={output.output} />
							)}

							{/* Action buttons  */}
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
										className="bg-green-600 hover:bg-green-700"
									>
										Review Answers
									</Button>
								)}
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>

			{showSummary && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
								className="bg-green-600 hover:bg-green-700"
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
