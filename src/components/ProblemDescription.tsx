import React from "react";
import { TabsContent } from "@/components/ui/tabs";

const ProblemDescription = ({ name }: { name: string }) => {
	return (
		<TabsContent
			value={name}
			className="h-[calc(100vh-8rem)] overflow-y-auto"
		>
			<div className="p-4">
				<h2 className="text-2xl font-bold mb-4">{name}</h2>
				<div>
					<p>{name + " x 100"}</p>
				</div>
			</div>
		</TabsContent>
	);
};

export default ProblemDescription;
