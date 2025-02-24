import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProblemDescriptionFormatter from "./ProblemDescriptionFormatter";
import TableDisplay from "./TableDisplay";
import ZoomableImage from "../ZoomableImage";
import Link from "next/link";

const ProblemDescription = ({
	name,
	content,
	questionNumber,
	tableData,
	erdImageUrl,
}: {
	name: string;
	content?: string;
	questionNumber?: number;
	tableData?: { [key: string]: string }[];
	erdImageUrl?: string;
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
							<>
								<ProblemDescriptionFormatter
									content={content}
								/>
								<TableDisplay tableData={tableData || []} />
							</>
						) : (
							<div className="text-center text-gray-500">
								No description available
							</div>
						)}
					</>
				) : name === "erd" ? (
					<div className="space-y-4">
						<div className="prose max-w-none space-y-2">
							<h3 className="text-lg font-bold">
								Entity Relationship Diagram (ERD)
							</h3>
							<p>
								The Northwind database contains the sales data
								for a fictitious company called{" "}
								<Link
									href="https://github.com/yugabyte/yugabyte-db/wiki/Northwind-Sample-Database"
									className="text-blue-600 hover:text-blue-800 underline"
									target="_blank"
								>
									Northwind Traders
								</Link>
								, which imports and exports specialty foods from
								around the world. The dataset consists of 13
								tables and the table relationships are showcased
								in the entity relationship diagram below:
							</p>
						</div>
						<div>
							{erdImageUrl ? (
								<ZoomableImage src={erdImageUrl} />
							) : (
								<div className="text-gray-500">
									No ERD image available
								</div>
							)}
						</div>
						The name of the table <strong>"Order Details"</strong>{" "}
						contains a space. Always include it in a double
						quotation mark <code>""</code>.
					</div>
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
