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
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Quae tempore, laborum recusandae ipsum totam nam debitis
						at saepe quis dolorum voluptates tempora quaerat
						temporibus ratione quibusdam iste? Asperiores, vel
						laboriosam sed consectetur nemo quisquam ipsa quo
						voluptate quae possimus labore minima nulla perspiciatis
						nam. Itaque accusamus quia necessitatibus aliquam in.
					</p>
				</div>
			</div>
		</TabsContent>
	);
};

export default ProblemDescription;
