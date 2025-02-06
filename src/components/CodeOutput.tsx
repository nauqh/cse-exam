import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const CodeOutput = ({ data }: { data: Record<string, string>[] | string }) => {
	if (data === "") {
		return (
			<div className="min-h-[150px] bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex overflow-y-auto"></div>
		);
	}

	if (typeof data === "string") {
		return (
			<div className="min-h-[150px] bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex overflow-y-auto">
				{data}
			</div>
		);
	}

	if (!Array.isArray(data) || data.length === 0) {
		return (
			<div className="min-h-[150px] flex items-center justify-center text-gray-500">
				No data available
			</div>
		);
	}

	const columns = Object.keys(data[0]);

	return (
		<div className="max-h-[150px] overflow-auto">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead key={column}>{column}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row, rowIndex) => (
						<TableRow key={rowIndex}>
							{columns.map((column) => (
								<TableCell key={`${rowIndex}-${column}`}>
									{row[column] ?? "-"}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default CodeOutput;
