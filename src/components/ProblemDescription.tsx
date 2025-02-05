import React from "react";
import { TabsContent } from "@/components/ui/tabs";

const ProblemDescription = ({
	name,
	content,
}: {
	name: string;
	content: string;
}) => {
	return (
		<TabsContent
			value={name}
			className="h-[calc(100vh-180px)] overflow-y-auto"
		>
			<div className="p-4">
				<h2 className="text-2xl font-bold mb-4 capitalize">{name}</h2>
				<div className="my-8">{content}</div>
			</div>
		</TabsContent>
	);
};

export default ProblemDescription;
