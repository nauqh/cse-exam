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

// Define the valid value types that can be displayed
type DisplayValueType = string | number | boolean | null | undefined | object;

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
		
		// Check if it's a single value output
		if (typeof outputData === "object" && !Array.isArray(outputData) && 'type' in outputData && outputData.type === "value") {
			const valueData = outputData.data;
			
			return (
				<div className="h-full bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg flex items-center justify-center 2xl:text-xl">
					<div className="text-center">
						<div className="text-xl font-semibold mb-2">Result</div>
						<div className="text-3xl">{formatValue(valueData)}</div>
					</div>
				</div>
			);
		}
		
		// Check if it's the new dataframe format
		if (typeof outputData === "object" && !Array.isArray(outputData) && 'type' in outputData && outputData.type === "dataframe") {
			const dataframeData = outputData.data;
			
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
		
		// Check if it's a pandas Series format
		if (typeof outputData === "object" && !Array.isArray(outputData) && 'type' in outputData && outputData.type === "series") {
			const seriesData = outputData.data;
			
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
		
		// Handle string or array output directly
		if (typeof outputData === "string") {
			return (
				<div className="h-full bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex overflow-y-auto 2xl:text-xl">
					{outputData}
				</div>
			);
		}
		
		// Handle array output
		if (Array.isArray(outputData)) {
			if (outputData.length === 0) {
				return (
					<div className="min-h-[150px] flex items-center justify-center text-gray-500 2xl:text-xl">
						No data available
					</div>
				);
			}
			
			const columns = Object.keys(outputData[0]);

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
							{outputData.map((row, rowIndex) => (
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
			<div className="h-full bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg flex items-center justify-center 2xl:text-xl">
				<div className="text-center">
					<div className="text-xl font-semibold mb-2">Result</div>
					<div className="text-3xl">{formatValue(valueData)}</div>
				</div>
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
