"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatusFilters } from "@/components/exam/StatusFilters";
import { ExamCard } from "@/components/exam/ExamCard";
import { ExamHistory } from "@/components/exam/ExamCard";
import { DateFilter } from "@/components/exam/DateFilter";

export default function ProfilePage() {
	const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
	const [selectedExam, setSelectedExam] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<
		ExamHistory["status"] | null
	>(null);
	const [selectedDate, setSelectedDate] = useState<Date>();

	const examFilters = [
		{ id: "M11", label: "SQL Intro" },
		{ id: "M12", label: "Advanced SQL" },
		{ id: "M21", label: "Python 101" },
		{ id: "M31", label: "Pandas 101" },
	];

	useEffect(() => {
		const mockHistory: ExamHistory[] = [
			{
				id: "M11-1",
				title: "M1.1 Introduction to SQL",
				date: "2024-03-15",
				status: "completed",
				score: 85,
			},
			{
				id: "M11-2",
				title: "M1.1 Introduction to SQL",
				date: "2024-03-16",
				status: "completed",
				score: 92,
			},
			{
				id: "M11-3",
				title: "M1.1 Introduction to SQL",
				date: "2024-03-16",
				status: "failed",
				score: 70,
			},
			{
				id: "M12",
				title: "M1.2 Advanced SQL",
				date: "2024-03-16T17:20",
				status: "marking",
			},
			{
				id: "M21",
				title: "M2.1 Python 101",
				date: "2024-03-14",
				status: "failed",
				score: 75,
			},
			{
				id: "M31",
				title: "M3.1 Pandas 101",
				date: "2024-03-17",
				status: "incomplete",
			},
		];
		setExamHistory(mockHistory);
	}, []);

	const filteredHistory = examHistory
		.filter((exam) =>
			selectedExam ? exam.id.startsWith(selectedExam) : true
		)
		.filter((exam) =>
			selectedStatus ? exam.status === selectedStatus : true
		)
		.filter((exam) =>
			selectedDate
				? new Date(exam.date).toDateString() ===
				  selectedDate.toDateString()
				: true
		);

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto space-y-8">
				<section className="text-center space-y-4">
					<h1 className="text-4xl font-bold">My Profile</h1>
					<p className="text-xl text-muted-foreground">
						View your exam history and progress
					</p>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-semibold">Exam History</h2>
					<div className="space-y-4">
						<div className="space-y-2">
							<div className="flex flex-wrap gap-2">
								<Button
									variant={
										selectedExam === null
											? "default"
											: "outline"
									}
									onClick={() => {
										setSelectedExam(null);
										setSelectedStatus(null);
									}}
								>
									All Exams
								</Button>
								{examFilters.map((filter) => (
									<Button
										key={filter.id}
										variant={
											selectedExam === filter.id
												? "default"
												: "outline"
										}
										onClick={() =>
											setSelectedExam(filter.id)
										}
									>
										{filter.label}
									</Button>
								))}
							</div>
							{selectedExam && (
								<>
									<StatusFilters
										selectedStatus={selectedStatus}
										setSelectedStatus={setSelectedStatus}
									/>
									<DateFilter
										selectedDate={selectedDate}
										setSelectedDate={setSelectedDate}
									/>
								</>
							)}
						</div>

						<div className="grid gap-4">
							{filteredHistory.map((exam) => (
								<ExamCard key={exam.id} exam={exam} />
							))}
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
