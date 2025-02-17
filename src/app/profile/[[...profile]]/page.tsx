"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { StatusFilters } from "@/components/exam/StatusFilters";
import { ExamCard } from "@/components/exam/ExamCard";
import { ExamSubmission } from "@/components/exam/ExamCard";
import { DateFilter } from "@/components/exam/DateFilter";
import { BiCommentError } from "react-icons/bi";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "react-day-picker";
import { useUser, UserProfile } from "@clerk/nextjs";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export default function ProfilePage() {
	const { user } = useUser();
	const [currentView, setCurrentView] = useState<"history" | "settings">(
		"history"
	);
	const [examHistory, setExamHistory] = useState<ExamSubmission[]>([]);
	const [selectedExam, setSelectedExam] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<
		ExamSubmission["status"] | null
	>(null);
	const [dateRange, setDateRange] = useState<DateRange>();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		const fetchExamHistory = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					`https://cspyclient.up.railway.app/submissions?email=${user?.emailAddresses}`
				);

				if (response.status === 404) {
					setError(
						"No exam submission found, please attempt the exams."
					);
					setExamHistory([]);
					return;
				}

				if (!response.ok) {
					throw new Error("Failed to fetch exam history");
				}

				const data = await response.json();
				setExamHistory(data);
				setError(null);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch exam history"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchExamHistory();
	}, [user?.emailAddresses]);

	const filteredHistory = examHistory
		.filter((exam) =>
			selectedExam ? exam.exam_id.startsWith(selectedExam) : true
		)
		.filter((exam) =>
			selectedStatus ? exam.status === selectedStatus : true
		)
		.filter((exam) => {
			if (!dateRange) return true;
			const examDate = new Date(exam.submitted_at);
			const isAfterStart = dateRange.from
				? examDate >= dateRange.from
				: true;
			const isBeforeEnd = dateRange.to ? examDate <= dateRange.to : true;
			return isAfterStart && isBeforeEnd;
		});

	const LoadingSkeleton = () => (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="flex flex-wrap gap-2">
					{[1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} className="h-10 w-24" />
					))}
				</div>
			</div>
			<div className="grid gap-4">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-[140px] w-full" />
				))}
			</div>
		</div>
	);

	return (
		<div className="flex h-screen">
			<Sidebar
				currentView={currentView}
				setCurrentView={setCurrentView}
			/>

			<main className="flex-1 overflow-auto">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto space-y-8">
						<section className="text-center space-y-4">
							<h1 className="text-3xl font-bold">My Profile</h1>
							<p className="text-lg text-muted-foreground">
								View your exam history and manage your profile
							</p>
						</section>

						{currentView === "settings" ? (
							<section className="space-y-6">
								<UserProfile />
							</section>
						) : (
							<section className="space-y-6">
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-semibold">
										Exam History
									</h2>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setShowFilters(!showFilters)
										}
										className="flex items-center gap-2"
									>
										<Filter className="h-4 w-4" />
										Filters
										{showFilters ? (
											<ChevronUp className="h-4 w-4" />
										) : (
											<ChevronDown className="h-4 w-4" />
										)}
									</Button>
								</div>

								{isLoading ? (
									<LoadingSkeleton />
								) : error ? (
									<div className="flex items-center justify-center p-8 rounded-lg bg-red-50 border border-red-200">
										<p className="text-red-600 font-medium text-lg flex items-center gap-2">
											<BiCommentError />
											{error}
										</p>
									</div>
								) : (
									<div className="space-y-4">
										<div
											className={`space-y-2 transition-all duration-300 ${
												showFilters ? "block" : "hidden"
											} bg-muted/50 p-4 rounded-lg border`}
										>
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
												{[
													{
														id: "M11",
														label: "SQL Intro",
													},
													{
														id: "M12",
														label: "Advanced SQL",
													},
													{
														id: "M21",
														label: "Python 101",
													},
													{
														id: "M31",
														label: "Pandas 101",
													},
												].map((filter) => (
													<Button
														key={filter.id}
														variant={
															selectedExam ===
															filter.id
																? "default"
																: "outline"
														}
														onClick={() =>
															setSelectedExam(
																filter.id
															)
														}
													>
														{filter.label}
													</Button>
												))}
											</div>
											<StatusFilters
												selectedStatus={selectedStatus}
												setSelectedStatus={
													setSelectedStatus
												}
											/>
											<DateFilter
												dateRange={dateRange}
												setDateRange={setDateRange}
											/>
										</div>

										<div className="grid gap-4">
											{filteredHistory.map(
												(exam, index) => (
													<ExamCard
														key={index}
														exam={exam}
													/>
												)
											)}
										</div>
									</div>
								)}
							</section>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
