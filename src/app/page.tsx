import Link from "next/link";
import { Button } from "@/components/ui/button";

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
	return (
		<main className="container mx-auto px-4 py-8">
			<div className="max-w-6xl mx-auto space-y-8">
				<section className="text-center space-y-4">
					<h1 className="text-4xl font-bold">Coderschool e-Exam</h1>
					<p className="text-xl text-muted-foreground">
						Select a course to start your assessment
					</p>
				</section>

				<section className="grid gap-6 md:grid-cols-2">
					{courses.map((course) => (
						<div
							key={course.id}
							className="p-6 border rounded-lg space-y-4 hover:border-primary transition-colors"
						>
							<h2 className="text-2xl font-semibold">
								{course.title}
							</h2>
							<p className="text-muted-foreground">
								{course.description}
							</p>
							<Link href={course.path}>
								<Button className="w-full my-2">
									Take Exam
								</Button>
							</Link>
						</div>
					))}
				</section>
			</div>
		</main>
	);
}
