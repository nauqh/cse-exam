"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { BiHelpCircle, BiNetworkChart, BiX, BiUpload } from "react-icons/bi";
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
import type { EditorView } from "@uiw/react-codemirror";
import { Input } from "@/components/ui/input";

type OutputType = {
	output: Record<string, string>[] | string;
	language: string;
};

type FileData = {
	name: string;
	size: number;
	type: string;
	content: string;
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
	const editorRef = useRef<{ view?: EditorView }>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [code, setCode] = useState<string>("");
	const [output, setOutput] = useState<OutputType>({
		output: "",
		language: "",
	});
	const [language, setLanguage] = useState(data.language);
	const [currentPage, setCurrentPage] = useState(initialProblemId);
	const [answeredProblems, setAnsweredProblems] = useState<{
		[problemId: number]: {
			code: string;
			language: string;
			files?: FileData[];
		};
	}>({});
	const [showSummary, setShowSummary] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

	useEffect(() => {
		const savedAnswers = localStorage.getItem("problemAnswers");
		if (savedAnswers) {
			setAnsweredProblems(JSON.parse(savedAnswers));
		}
	}, []);

	useEffect(() => {
		if (currentPage > data.content.length || currentPage < 1) {
			router.push(`/v0/${examId}/problem/1`);
		}
	}, [currentPage, data.content.length, examId, router]);

	useEffect(() => {
		if (answeredProblems[currentPage]) {
			setCode(answeredProblems[currentPage].code);
			setLanguage(answeredProblems[currentPage].language);
			setUploadedFiles(answeredProblems[currentPage].files || []);
		} else {
			setCode("");
			setUploadedFiles([]);
		}
	}, [currentPage, answeredProblems]);

	const currentProblem = data.content[currentPage - 1];

	// Add prefetching for next problem
	useEffect(() => {
		if (currentPage < data.content.length) {
			router.prefetch(`/v0/${examId}/problem/${currentPage + 1}`);
		}
	}, [currentPage, data.content.length, examId, router]);

	// Update page change handler for client-side navigation
	const handlePageChange = useCallback(
		(page: number) => {
			setCurrentPage(page);
			router.replace(`/v0/${examId}/problem/${page}`, {
				scroll: false,
			});
		},
		[router, examId]
	);

	const handleCodeChange = useCallback((value: string) => {
		setCode(value);
	}, []);

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);

			if (uploadedFiles.length + files.length > 3) {
				toast({
					description: "Maximum 3 files allowed per problem",
					className: "bg-yellow-100 text-yellow-900 border-none",
					duration: 3000,
				});
				return;
			}

			// Process each file
			files.forEach((file) => {
				const reader = new FileReader();
				reader.onload = (event) => {
					if (event.target && event.target.result) {
						const newFile: FileData = {
							name: file.name,
							size: file.size,
							type: file.type,
							content: event.target.result as string,
						};

						setUploadedFiles((prev) => [...prev, newFile]);
					}
				};
				reader.readAsDataURL(file);
			});

			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const removeFile = (index: number) => {
		setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
	};

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

	// Update submit handler for client-side navigation
	const handleSubmit = useCallback(() => {
		if (!code.trim()) {
			toast({
				description: "Please write some code before submitting",
				className: "bg-yellow-100 text-yellow-900 border-none",
				duration: 3000,
			});
			return;
		}

		const newAnswers = {
			...answeredProblems,
			[currentPage]: {
				code,
				language,
				files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
			},
		};

		setAnsweredProblems(newAnswers);
		localStorage.setItem("problemAnswers", JSON.stringify(newAnswers));

		if (currentPage < data.content.length) {
			setCurrentPage(currentPage + 1);
			router.replace(`/v0/${examId}/problem/${currentPage + 1}`, {
				scroll: false,
			});
		}
	}, [
		code,
		language,
		currentPage,
		answeredProblems,
		data.content.length,
		examId,
		router,
		toast,
		uploadedFiles,
	]);

	const handleReset = () => {
		const newAnswers = { ...answeredProblems };
		delete newAnswers[currentPage];
		setAnsweredProblems(newAnswers);
		setCode("");
		setOutput({ output: "", language });
		setUploadedFiles([]);
		localStorage.setItem("problemAnswers", JSON.stringify(newAnswers));
	};

	const handleFinishSection = () => {
		router.push(`/v0/${examId}/final`);
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

			if (editorRef.current?.view) {
				editorRef.current.view.focus();
			}
		};

		window.addEventListener("keydown", handleGlobalKeyPress);
		return () => {
			window.removeEventListener("keydown", handleGlobalKeyPress);
		};
	}, []);

	// Add memoization for code output
	const memoizedOutput = React.useMemo(
		() => <CodeOutput data={output.output} />,
		[output.output]
	);

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
							<TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-none sticky top-0 z-10">
								<TabsTrigger
									value="description"
									className="hover:bg-gray-100 flex items-center gap-2"
								>
									<BiHelpCircle className="w-4 h-4" />
									Description
								</TabsTrigger>
								<TabsTrigger
									value="erd"
									className="hover:bg-gray-100 flex items-center gap-2"
								>
									<BiNetworkChart className="w-4 h-4" />
									ERD
								</TabsTrigger>
								{/* <TabsTrigger
									value="discussion"
									className="hover:bg-gray-100 flex items-center gap-2"
								>
									<BiMessageRoundedDots className="w-4 h-4" />
									Discussion
								</TabsTrigger> */}
							</TabsList>
							<ProblemDescription
								name="description"
								content={currentProblem?.question}
								questionNumber={currentPage}
								{...(currentProblem?.tableData && {
									tableData: currentProblem.tableData,
								})}
							/>
							<ProblemDescription
								name="erd"
								erdImageUrl="https://camo.githubusercontent.com/a0a377ee0279de8567c9fcb6492e04c76cde6bac5aeb04e2acf5b69b62fd9184/68747470733a2f2f7374617469632e7061636b742d63646e2e636f6d2f70726f64756374732f393738313738323137303930372f67726170686963732f30393037454e5f30325f30392e6a7067"
							/>
							{/* <ProblemDescription name="discussion" /> */}
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
										<SelectItem value="text">Text</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* File upload section */}
							<div className="bg-gray-50 p-2 border-b">
								<div className="flex items-center justify-between">
									<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
										<BiUpload className="h-4 w-4" />
										Attach files
									</label>
									<span className="text-xs text-gray-500">
										{uploadedFiles.length}/3 files
									</span>
								</div>
								<div className="flex items-center gap-2 mt-1">
									<Input
										ref={fileInputRef}
										type="file"
										accept=".java,.py,.js,.c,.cpp,.sql,.html,.css,.tsx,.jsx,.ts"
										multiple
										onChange={handleFileUpload}
										className="cursor-pointer text-xs"
										disabled={uploadedFiles.length >= 3}
									/>
									
									<Button
										variant="outline"
										size="sm"
										className="text-xs"
										disabled={uploadedFiles.length >= 3}
										onClick={() =>	
											fileInputRef.current?.click()
										}
									>
										Browse
									</Button>
								</div>
								<p className="mt-1 text-xs text-gray-500">
										Accepted formats: .java, .py, .js, .c, .cpp, .sql, .html, .css, .tsx, .jsx, .ts
								</p>

								{/* Display uploaded files */}
								{uploadedFiles.length > 0 && (
									<div className="flex flex-wrap gap-2 mt-2">
										{uploadedFiles.map((file, index) => (
											<div
												key={index}
												className="flex items-center gap-1 text-xs bg-gray-100 p-1 pr-2 rounded-md group"
											>
												<button
													type="button"
													onClick={() =>
														removeFile(index)
													}
													className="p-1 text-red-500 rounded-full hover:bg-red-100"
												>
													<BiX className="h-3 w-3" />
												</button>
												<span className="truncate max-w-[150px]">
													{file.name} (
													{Math.round(
														file.size / 1024
													)}
													KB)
												</span>
											</div>
										))}
									</div>
								)}
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

						{language !== "text" ? (
							<>
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

									{memoizedOutput}

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
							</>
						) : (
							<>
								<ResizableHandle className="w-1 bg-gray-50 hover:bg-gray-100 cursor-col-resize" />
								<ResizablePanel
									defaultSize={10}
									minSize={10}
									maxSize={10}
									className="h-52 p-4 border-t flex flex-col"
								>
									<div className="flex gap-4 justify-end mt-auto pt-2">
										<Button variant="outline" onClick={handleReset}>
											Reset
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
							</>
						)}
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

									{/* Display uploaded files in summary */}
									{answeredProblems[index + 1]?.files &&
										answeredProblems[index + 1]?.files!
											.length > 0 && (
											<div className="mt-2">
												<p className="text-sm font-medium">
													Attached Files:
												</p>
												<div className="flex flex-wrap gap-2 mt-1">
													{answeredProblems[
														index + 1
													]?.files!.map(
														(file, fileIndex) => (
															<div
																key={fileIndex}
																className="text-xs bg-gray-100 p-1 px-2 rounded-md"
															>
																{file.name} (
																{Math.round(
																	file.size /
																		1024
																)}
																KB)
															</div>
														)
													)}
												</div>
											</div>
										)}
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
