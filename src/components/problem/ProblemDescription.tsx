import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProblemDescriptionFormatter from "./ProblemDescriptionFormatter";

const ProblemDescription = ({
	name,
	content,
}: {
	name: string;
	content?: string;
}) => {
	return (
		<TabsContent
			value={name}
			className="h-[calc(100vh-180px)] overflow-y-auto"
		>
			<div className="p-4">
				{name === "description" ? (
					<>
						<h2 className="text-2xl font-bold mb-4 capitalize">
							{name}
						</h2>
						<div className="my-4">
							{content ? (
								<ProblemDescriptionFormatter
									content={content}
								/>
							) : (
								<div className="text-center text-gray-500">
									No description available
								</div>
							)}
						</div>
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
