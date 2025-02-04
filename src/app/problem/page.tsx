"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { BiHelpCircle, BiCodeAlt, BiMessageRoundedDots } from "react-icons/bi";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import ProblemDescription from "@/components/ProblemDescription";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
	const [code, setCode] = useState<string>("");
	const [output, setOutput] = useState<string | React.ReactElement>("");
	const [language, setLanguage] = useState("python");

	const handleCodeChange = useCallback((value: string) => {
		setCode(value);
	}, []);

	const handleRunCode = async () => {
		try {
			setOutput("Executing...");
			const response = await fetch(
				"https://cspyclient.up.railway.app/execute",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						code: code,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				setOutput(`Error: ${errorData.detail}`);
				return;
			}

			const data = await response.json();
			setOutput(data.output);
		} catch (error) {
			setOutput("Error connecting to the server. Please try again.");
		}
	};

	return (
		<div className="h-full p-2">
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel defaultSize={50} minSize={30}>
					<div className="h-full">
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
							<ProblemDescription name="description" />
							<ProblemDescription name="solutions" />
							<ProblemDescription name="discussion" />
						</Tabs>
					</div>
				</ResizablePanel>

				<ResizableHandle className="w-1 bg-gray-50 hover:bg-gray-100 cursor-col-resize" />

				<ResizablePanel defaultSize={50} minSize={30}>
					<ResizablePanelGroup
						direction="vertical"
						className="h-full flex flex-col border rounded-md"
					>
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

						<ResizablePanel
							defaultSize={35}
							minSize={35}
							className="h-52 p-4 border-t flex flex-col"
						>
							<div className="text-lg mb-2 font-semibold">
								Output
							</div>
							<div className="min-h-[150px] h-fit overflow-auto bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex">
								{output}
							</div>
							<div className="flex gap-4 justify-end mt-auto pt-2">
								<Button
									variant="outline"
									onClick={handleRunCode}
								>
									Run Code
								</Button>
								<Button>Submit</Button>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
