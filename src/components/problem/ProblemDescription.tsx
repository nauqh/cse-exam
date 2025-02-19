import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProblemDescriptionFormatter from "./ProblemDescriptionFormatter";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const mockData = [
	{
		testCase: "Test Case 1",
		input: "5",
		expectedOutput: "120",
		explanation: "Factorial of 5",
	},
	{
		testCase: "Test Case 2",
		input: "3",
		expectedOutput: "6",
		explanation: "Factorial of 3",
	},
	{
		testCase: "Test Case 3",
		input: "0",
		expectedOutput: "1",
		explanation: "Factorial of 0",
	},
];

const ProblemDescription = ({
	name,
	content,
	questionNumber,
	tableData,
}: {
	name: string;
	content?: string;
	questionNumber?: number;
	tableData?: { [key: string]: string }[];
}) => {
	const columns = Object.keys(mockData[0]);

	return (
		<TabsContent value={name} className="overflow-y-auto">
			<div className="px-4">
				{name === "description" ? (
					<>
						<h2 className="text-xl font-bold">
							Question {questionNumber}
						</h2>
						{content ? (
							<ProblemDescriptionFormatter
								content={content}
								tableData={tableData}
							/>
						) : (
							<div className="text-center text-gray-500">
								No description available
							</div>
						)}
					</>
				) : (
					<div className="text-center text-gray-500">
						No {name} available
					</div>
				)}
			</div>
		</TabsContent>
	);
};

export default ProblemDescription;
