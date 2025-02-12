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
		<TabsContent value={name} className="overflow-y-auto">
			<div className="px-4">
				{name === "description" ? (
					<>
						<h2 className="text-xl font-bold capitalize">{name}</h2>
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
