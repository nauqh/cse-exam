import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const ProblemDescriptionFormatter = ({ content }: { content: string }) => {
	// Split content into sections based on code blocks
	const parts = content.split("```");

	return (
		<div className="prose dark:prose-invert max-w-none">
			{parts.map((part, index) => {
				if (index % 2 === 0) {
					// Text content
					return (
						<ReactMarkdown
							key={index}
							components={{
								strong: ({ children }) => (
									<span className="font-bold text-primary">
										{children}
									</span>
								),
								blockquote: ({ children }) => (
									<blockquote className="border-l-4 border-primary/50 pl-4 italic">
										{children}
									</blockquote>
								),
								code: ({ children }) => (
									<code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm">
										{children}
									</code>
								),
							}}
						>
							{part}
						</ReactMarkdown>
					);
				} else {
					// Code block
					return (
						<pre
							key={index}
							className={cn(
								"bg-zinc-950 text-zinc-50 p-4 rounded-lg my-4",
								"font-mono text-sm overflow-x-auto"
							)}
						>
							<code>{part.trim()}</code>
						</pre>
					);
				}
			})}
		</div>
	);
};

export default ProblemDescriptionFormatter;
