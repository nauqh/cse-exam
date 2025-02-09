"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import MenuSheet from "@/components/MenuSheet";

const courses = [
	{
		id: "m1-1",
		title: "M1.1 Introduction to SQL",
		description:
			"Learn the fundamentals of SQL including basic queries, joins, and database concepts",
		path: "/exams/M11",
	},
	{
		id: "m1-2",
		title: "M1.2 Advanced SQL",
		description:
			"Master complex SQL queries, stored procedures, and database optimization",
		path: "/exams/M12",
	},
	{
		id: "m2-1",
		title: "M2.1 Python 101",
		description:
			"Introduction to Python programming language and basic programming concepts",
		path: "/exams/M21",
	},
	{
		id: "m3-1",
		title: "M3.1 Pandas 101",
		description:
			"Learn data manipulation and analysis with Python Pandas library",
		path: "/exams/M31",
	},
];

export default function Home() {
	useEffect(() => {
		localStorage.clear();
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-500/40 via-purple-400/30 to-pink-300/30">
			<MenuSheet />
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto space-y-12">
					<section className="text-center space-y-4">
						<h1 className="text-4xl font-extrabold text-primary">
							eExams
						</h1>
						<p className="text-xl text-gray">
							Select a course to start your assessment
						</p>
					</section>

					<section className="grid gap-8 md:grid-cols-2">
						{courses.map((course) => (
							<Link
								key={course.id}
								href={course.path}
								className="block"
							>
								<div
									className="group p-8 rounded-xl space-y-4 transition-all duration-300 
                              backdrop-blur-md bg-white/20 border border-white/30
                              hover:bg-white/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
								>
									<h2 className="text-2xl font-semibold text-gray-800 transition-colors">
										{course.title}
									</h2>
									<p className="text-gray-600 text-lg">
										{course.description}
									</p>

									<Button
										className="w-full 
								transition-colors duration-300 border-none 
								shadow-md hover:shadow-lg"
									>
										Start Exam →
									</Button>
								</div>
							</Link>
						))}
					</section>
				</div>
			</main>
		</div>
	);
}
