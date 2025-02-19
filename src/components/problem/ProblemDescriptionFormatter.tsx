import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import ZoomableImage from "../ZoomableImage";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const ProblemDescriptionFormatter = ({
	content,
	tableData,
}: {
	content: string;
	tableData?: { [key: string]: string }[];
}) => {
	const processedContent = content.replace(/<br\/>/g, "\n\n");
	const parts = processedContent.split(/(```[^`]*```)/g);

	return (
		<div className="prose dark:prose-invert max-w-none">
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
								blockquote: ({ children }) => (
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
									src && <ZoomableImage src={src} />,

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

			{tableData && (
				<div className="my-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead></TableHead>
								{Object.keys(tableData[0]).map((header) => (
									<TableHead
										key={header}
										className="capitalize"
									>
										{header
											.replace(/([A-Z])/g, " $1")
											.trim()}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{tableData.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{index + 1}</TableCell>
									{Object.values(row).map(
										(value, cellIndex) => (
											<TableCell key={cellIndex}>
												{value}
											</TableCell>
										)
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
};

export default ProblemDescriptionFormatter;
