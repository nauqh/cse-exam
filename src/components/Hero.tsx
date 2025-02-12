import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaUserGraduate, FaStar, FaClipboardCheck } from "react-icons/fa";

export default function HeroSection() {
	return (
		<section className="relative px-6">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
				{/* LEFT SIDE – TEXT & CTA */}
				<div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
					<h1 className="text-5xl font-extrabold leading-tight text-primary">
						<span
							className="font-extrabold bg-clip-text text-transparent 
                       bg-gradient-to-r from-blue-500 to-teal-400"
						>
							eExams
						</span>{" "}
						is Here to Elevate Your Learning!
					</h1>
					<p className="text-lg text-gray-600">
						A next-gen platform for secure, AI-powered online
						assessments. Take exams confidently anytime, anywhere!
					</p>
					<div className="flex flex-wrap gap-6 justify-center md:justify-start">
						<Link href="/exams">
							<Button className="text-lg px-8 py-6 bg-[#1d283a] hover:bg-[#2a3a52]">
								Attempt Exams
							</Button>
						</Link>
						<Link href="/about">
							<Button
								variant="outline"
								className="text-lg px-8 py-6"
							>
								Learn More
							</Button>
						</Link>
					</div>
					<div className="flex gap-6 mt-6 justify-center md:justify-start">
						<div className="flex items-center space-x-2 text-gray-700">
							<FaUserGraduate className="w-6 h-6 text-blue-500" />
							<span className="text-lg font-semibold">
								50K+ Students
							</span>
						</div>
						<div className="flex items-center space-x-2 text-gray-700">
							<FaStar className="w-6 h-6 text-yellow-400" />
							<span className="text-lg font-semibold">
								4.9 Satisfaction
							</span>
						</div>
					</div>
				</div>

				{/* RIGHT SIDE – IMAGE */}
				<div className="w-full md:w-1/2 flex justify-center">
					<div className="relative w-80 h-80 md:w-96 md:h-96">
						{/* Decorative Paint Splash Background */}
						<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 transform -rotate-6 z-0" />

						<Image
							src="https://static.vecteezy.com/system/resources/previews/044/606/215/non_2x/happy-student-passed-online-test-girl-after-final-exam-dreaming-of-graduation-education-composition-doodle-icons-of-graduating-hat-and-laptop-illustration-of-success-in-studying-vector.jpg"
							alt="eExam Platform"
							fill
							className="rounded-3xl shadow-xl object-cover relative z-10"
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
