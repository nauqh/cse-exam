"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import PandasProblemIntro from "@/components/problem/intro/PandasProblemIntro";
import PythonProblemIntro from "@/components/problem/intro/PythonProblemIntro";
import SQLProblemIntro from "@/components/problem/intro/SQLProblemIntro";

export default function ProblemIntro({ examId }: { examId: string }) {
	const router = useRouter();

	const handleStart = () => {
		router.push(`/exams/${examId}/problem/1`);
	};

	return (
		<section className="container mx-auto px-4 py-8 space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-3xl font-bold">Problem Section</h1>
				<p className="text-xl text-primary">
					Please read the instructions carefully before starting
				</p>
			</div>

			<div className="prose prose-lg max-w-none">
				{examId === "M11" ? (
					<SQLProblemIntro />
				) : examId === "M12" ? (
					<SQLProblemIntro />
				) : examId === "M21" ? (
					<PythonProblemIntro />
				) : examId === "M31" ? (
					<PandasProblemIntro />
				) : null}
				<div className="text-center mt-8">
					<Button
						size="lg"
						className="px-8 uppercase"
						onClick={handleStart}
					>
						Start Problem Section
					</Button>
				</div>
			</div>
		</section>
	);
}
