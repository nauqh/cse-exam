import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProblemDescriptionFormatter from "./ProblemDescriptionFormatter";

const ProblemDescription = ({
	name,
	content,
	questionNumber,
}: {
	name: string;
	content?: string;
	questionNumber?: number;
}) => {
	return (
		<TabsContent value={name} className="overflow-y-auto">
			<div className="px-4">
				{name === "description" ? (
					<>
						<h2 className="text-xl font-bold">
							Question {questionNumber}
						</h2>
						{content ? (
							<ProblemDescriptionFormatter content={content} />
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
