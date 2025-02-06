"use client";

import { MdCalendarMonth } from "react-icons/md";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DateFilterProps {
	selectedDate: Date | undefined;
	setSelectedDate: (date: Date | undefined) => void;
}

export function DateFilter({ selectedDate, setSelectedDate }: DateFilterProps) {
	return (
		<div className="pl-4 border-l-2 border-muted">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className={`justify-start text-left font-normal ${
							!selectedDate && "text-muted-foreground"
						}`}
					>
						<MdCalendarMonth className="mr-2 h-4 w-4" />
						{selectedDate
							? format(selectedDate, "PPP")
							: "Pick a date"}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={setSelectedDate}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			{selectedDate && (
				<Button
					variant="ghost"
					size="sm"
					className="ml-2"
					onClick={() => setSelectedDate(undefined)}
				>
					Clear
				</Button>
			)}
		</div>
	);
}
