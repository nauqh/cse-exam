import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Adding interface for the new dataframe type
interface DataframeOutput {
  type: "dataframe";
  data: Record<string, unknown>[];
}

// Adding interface for pandas Series type
interface SeriesOutput {
  type: "series";
  data: Record<string, unknown>;
}

// Adding interface for single value type
interface ValueOutput {
  type: "value";
  data: string | number | boolean | null | undefined;
}

// Define the possible output types
type OutputData = string | Record<string, unknown>[] | DataframeOutput | SeriesOutput | ValueOutput;

// Extending the component's props type to handle the new format
const CodeOutput = ({ data }: { data: OutputData | { output: OutputData, language: string } }) => {
	// Handle empty data
	if (data === "") {
		return (
			<div className="h-full bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex overflow-y-auto"></div>
		);
	}

	// Format a value for display based on its type
	const formatValue = (value: unknown): string => {
		if (value === null || value === undefined) return "-";
		if (typeof value === 'number') {
			return Number.isInteger(value) ? 
				value.toString() : 
				value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 });
		}
		if (typeof value === 'object') {
			try {
				return JSON.stringify(value);
			} catch {
				return "[Object]";
			}
		}
		return String(value);
	};

	// Handle SQL dataframe format
	if (typeof data === "object" && !Array.isArray(data) && 'output' in data) {
		const outputData = data.output;
		// Simply pass the output data to the same component for processing
		return <CodeOutput data={outputData} />;
	}

	// Handle plain text output
	if (typeof data === "string") {
		return (
			<div className="h-full bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex overflow-y-auto 2xl:text-xl">
				{data}
			</div>
		);
	}

	// Handle value type directly
	if (typeof data === "object" && !Array.isArray(data) && 'type' in data && data.type === "value") {
		const valueData = data.data;
		
		return (
			<div className="h-full bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex overflow-y-auto 2xl:text-xl">
				{formatValue(valueData)}
			</div>
		);
	}

	// Handle dataframe type directly
	if (typeof data === "object" && !Array.isArray(data) && 'type' in data && data.type === "dataframe") {
		const dataframeData = data.data;
		
		if (!Array.isArray(dataframeData) || dataframeData.length === 0) {
			return (
				<div className="min-h-[150px] flex items-center justify-center text-gray-500 2xl:text-xl">
					No data available
				</div>
			);
		}

		const columns = Object.keys(dataframeData[0]);

		return (
			<div className="overflow-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead></TableHead>
							{columns.map((column) => (
								<TableHead key={column}>{column}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{dataframeData.map((row, rowIndex) => (
							<TableRow key={rowIndex}>
								<TableCell>{rowIndex + 1}</TableCell>
								{columns.map((column) => (
									<TableCell key={`${rowIndex}-${column}`}>
										{formatValue(row[column])}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	// Handle series type directly
	if (typeof data === "object" && !Array.isArray(data) && 'type' in data && data.type === "series") {
		const seriesData = data.data;
		
		if (!seriesData || Object.keys(seriesData).length === 0) {
			return (
				<div className="min-h-[150px] flex items-center justify-center text-gray-500 2xl:text-xl">
					No data available
				</div>
			);
		}

		return (
			<div className="overflow-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Index</TableHead>
							<TableHead>Value</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.entries(seriesData).map(([index, value], rowIndex) => (
							<TableRow key={rowIndex}>
								<TableCell>{index}</TableCell>
								<TableCell>
									{formatValue(value)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	// Handle array of records (original SQL output)
	if (!Array.isArray(data) || data.length === 0) {
		return (
			<div className="min-h-[150px] flex items-center justify-center text-gray-500 2xl:text-xl">
				No data available
			</div>
		);
	}

	const columns = Object.keys(data[0]);

	return (
		<div className="overflow-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead></TableHead>
						{columns.map((column) => (
							<TableHead key={column}>{column}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row, rowIndex) => (
						<TableRow key={rowIndex}>
							<TableCell>{rowIndex + 1}</TableCell>
							{columns.map((column) => (
								<TableCell key={`${rowIndex}-${column}`}>
									{formatValue(row[column])}
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
