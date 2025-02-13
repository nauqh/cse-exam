"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
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
import { ExamContent } from "@/lib/questions";
import CodeOutput from "@/components/CodeOutput";

type OutputType = {
	output: Record<string, string>[] | string;
	language: string;
};

export default function ProblemClient({
	data,
	examId,
	initialProblemId,
}: {
	data: ExamContent;
	examId: string;
	initialProblemId: number;
}) {
	const { toast } = useToast();
	const router = useRouter();
	const editorRef = useRef<any>(null);
	const [code, setCode] = useState<string>("");
	const [output, setOutput] = useState<OutputType>({
		output: "",
		language: "",
	});
	const [language, setLanguage] = useState(data.language);
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
		if (currentPage > data.content.length || currentPage < 1) {
			router.push(`/exams/${examId}/problem/1`);
		}
	}, [currentPage, data.content.length, examId, router]);

	useEffect(() => {
		if (answeredProblems[currentPage]) {
			setCode(answeredProblems[currentPage].code);
			setLanguage(answeredProblems[currentPage].language);
		} else {
			setCode("");
		}
	}, [currentPage, answeredProblems]);

	const currentProblem = data.content[currentPage - 1];

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

		if (currentPage < data.content.length) {
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
			} else if (event.shiftKey && event.key === "Enter") {
				event.preventDefault();
				handleSubmit();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleRunCode, handleSubmit]);

	// Add keyboard event listener for editor focus
	useEffect(() => {
		const handleGlobalKeyPress = (event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement
			) {
				return;
			}

			if (editorRef.current?.view?.focus) {
				editorRef.current.view.focus();
			}
		};

		window.addEventListener("keydown", handleGlobalKeyPress);
		return () => {
			window.removeEventListener("keydown", handleGlobalKeyPress);
		};
	}, []);

	return (
		<div className="p-6 h-[100vh] w-full">
			<ResizablePanelGroup direction="horizontal">
				{/* Problem description panel */}
				<ResizablePanel defaultSize={50} minSize={30}>
					<div className="h-full flex flex-col border rounded-sm justify-between">
						<Tabs
							defaultValue="description"
							className="overflow-auto [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100"
						>
							<TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-none sticky top-0 z-10">
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
								{ length: data.content.length },
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
							<div className="flex items-center justify-between p-2 border-b bg-gray-50">
								<div className="flex items-center gap-4">
									<h1 className="text-lg font-semibold">
										Input
									</h1>

									<span className="text-xs text-gray-500">
										<span className="text-xs text-gray-500 bg-gray-100 p-2 rounded-md">
											Ctrl+Enter
										</span>
										{" to run code"}
									</span>
									<span className="text-xs text-gray-500">
										<span className="text-xs text-gray-500 bg-gray-100 p-2 rounded-md">
											Shift+Enter
										</span>
										{" to submit"}
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

							<div className="flex-1 overflow-auto">
								<CodeMirror
									ref={editorRef}
									value={code}
									height="100%"
									onChange={handleCodeChange}
									className="h-full 2xl:text-xl"
								/>
							</div>
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
									data.content.length && (
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
						<h2 className="text-2xl font-bold mb-4">Summary</h2>
						<div className="space-y-4">
							{data.content.map((problem, index) => (
								<div key={index + 1} className="border-b pb-2">
									<p className="font-semibold">
										Problem {index + 1}:
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
