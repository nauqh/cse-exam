"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, FileText, Link as LinkIcon, Copy } from "lucide-react";
import CodeOutput from "@/components/CodeOutput";

type Link = {
	id: string;
	url: string;
	description: string;
	type: string;
	addedAt: number;
};

type File = {
	name: string;
	size: number;
	type: string;
	content: string;
};

type Answer = {
	answer: string;
	type: string;
	links?: Link[];
	files?: File[];
};

type Submission = {
	id: number;
	email: string;
	answers: Answer[];
	exam_id: string;
	exam_name: string;
	submitted_at: string;
	summary: string;
	score: number;
	channel: string | null;
	status: string;
};

// Function to decode base64 file content
const decodeBase64File = (content: string): string => {
	const base64Content = content.split(",")[1];
	if (!base64Content) return "Error decoding file content";

	try {
		return atob(base64Content);
	} catch (error) {
		console.error("Error decoding base64:", error);
		return "Error decoding file content";
	}
};

export default function MarkingClient({
	submissionId,
}: {
	submissionId: string;
}) {
	const [submission, setSubmission] = useState<Submission | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("submission");
	const [copiedToClipboard, setCopiedToClipboard] = useState(false);

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
				setSubmission(data);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to load submission data"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchSubmission();
	}, [submissionId]);

	const handleCopyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopiedToClipboard(true);
		setTimeout(() => setCopiedToClipboard(false), 2000);
	};

	if (loading) {
		return (
			<div className="container mx-auto py-12 max-w-6xl flex justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
					<p className="text-muted-foreground">Loading submission...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return <ErrorState error={error} />;
	}

	if (!submission) {
		return <ErrorState error="No submission data found" />;
	}

	return (
		<div className="container mx-auto py-8 max-w-5xl">
			<div className="flex flex-col gap-6">
				<Card className="shadow-sm">
					<CardHeader className="pb-3">
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
							<div>
								<CardTitle className="text-2xl font-bold">
									Submission review
								</CardTitle>
								<div className="text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
									<span className="font-medium">{submission.exam_name}</span>
									<span className="hidden sm:inline">•</span>
									<span>{submission.email}</span>
									<span className="hidden sm:inline">•</span>
									<span className="text-sm">
										{new Date(submission.submitted_at).toLocaleString()}
									</span>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
								<Badge
									variant={
										submission.status === "completed"
											? "default"
											: "outline"
									}
									className="px-3 py-1 uppercase text-xs tracking-wider"
								>
									{submission.status}
								</Badge>
								<div className="flex items-center gap-2 font-medium">
									<span>Score:</span>
									<span className={`text-lg font-bold ${
										submission.score >= 70 ? 'text-green-600' : 
										submission.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
										{submission.score}/100
									</span>
								</div>
							</div>
						</div>
					</CardHeader>
				</Card>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="mb-4 w-full sm:w-auto">
						<TabsTrigger 
							value="submission" 
							className="flex-1 sm:flex-initial"
						>
							Answers
						</TabsTrigger>
						<TabsTrigger 
							value="summary" 
							className="flex-1 sm:flex-initial"
						>
							Summary
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="submission"
						className="space-y-6 animate-in fade-in-50 duration-300"
					>
						{submission.answers.map((answer, index) => (
							<AnswerCard
								key={index}
								answer={answer}
								questionNumber={index + 1}
							/>
						))}
					</TabsContent>

					<TabsContent 
						value="summary"
						className="animate-in fade-in-50 duration-300"
					>
						<Card className="shadow-sm">
							<CardHeader className="pb-3 border-b">
								<div className="flex justify-between items-center">
									<CardTitle className="text-lg">Submission Summary</CardTitle>
									<button
										onClick={() => handleCopyToClipboard(submission.summary)}
										className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
										title="Copy summary to clipboard"
									>
										<Copy size={14} />
										<span>{copiedToClipboard ? "Copied!" : "Copy"}</span>
									</button>
								</div>
							</CardHeader>
							<CardContent className="pt-4">
								<pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-slate-50 rounded-md overflow-auto max-h-[500px]">
									{submission.summary}
								</pre>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

// Helper components
function ErrorState({ error }: { error: string }) {
	return (
		<div className="container mx-auto py-12 max-w-5xl">
			<Card className="shadow-sm">
				<CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
					<AlertCircle className="h-12 w-12 text-red-500 mb-4" />
					<p className="text-lg font-medium text-center">{error}</p>
					<p className="text-muted-foreground mt-2 text-center">
						Please try again or contact support if the issue persists.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

function AnswerCard({
	answer,
	questionNumber,
}: {
	answer: Answer;
	questionNumber: number;
}) {
	const renderAnswerContent = () => {
		switch (answer.type) {
			case "multichoice":
				return (
					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className="px-3 py-1 text-base"
						>
							{answer.answer}
						</Badge>
					</div>
				);

			case "python":
			case "sql":
				return (
					<CodeOutput data={answer.answer} />
				);

			case "text":
				return (
					<div className="p-4 bg-slate-50 border rounded-md">
						<p className="whitespace-pre-wrap">{answer.answer}</p>
					</div>
				);

			case "link":
				return (
					<div className="space-y-3">
						{answer.links?.length ? (
							answer.links.map((link) => (
								<div key={link.id} className="flex flex-col p-3 bg-slate-50 border rounded-md">
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline flex items-center gap-2"
									>
										<LinkIcon className="h-4 w-4" />
										{link.url}
									</a>
									{link.description && (
										<p className="text-sm text-muted-foreground ml-6 mt-1">
											{link.description}
										</p>
									)}
								</div>
							))
						) : (
							<p className="text-muted-foreground italic">No links provided</p>
						)}
					</div>
				);

			case "file":
				return (
					<div className="space-y-4">
						{answer.files?.length ? (
							answer.files.map((file) => (
								<div
									key={file.name}
									className="border rounded-md overflow-hidden shadow-sm"
								>
									<div className="bg-slate-100 px-4 py-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<FileText className="h-4 w-4 text-blue-500" />
											<span className="font-medium">
												{file.name}
											</span>
										</div>
										<Badge variant="outline" className="text-xs">
											{(file.size / 1024).toFixed(1)} KB
										</Badge>
									</div>
									<div className="overflow-hidden">
										<CodeOutput
											data={decodeBase64File(
												file.content
											)}
										/>
									</div>
								</div>
							))
						) : (
							<p className="text-muted-foreground italic">No files submitted</p>
						)}
					</div>
				);

			default:
				return <p>Unsupported answer type: {answer.type}</p>;
		}
	};

	return (
		<Card className="shadow-sm">
			<CardHeader className="pb-3 flex flex-row justify-between items-center border-b">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center bg-slate-100 w-8 h-8 rounded-full">
						<CardTitle className="text-sm font-bold">{questionNumber}</CardTitle>
					</div>
					<Badge variant="outline" className="capitalize text-xs px-2 py-0.5">
						{answer.type}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				{renderAnswerContent()}
			</CardContent>
		</Card>
	);
}
