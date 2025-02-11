import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MenuSheet from "@/components/MenuSheet";
import {
	FaGraduationCap,
	FaChartLine,
	FaClock,
	FaBook,
	FaDesktop,
	FaQuestion,
	FaHeadset,
	FaCode,
	FaLanguage,
} from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";

const features = [
	{
		icon: <FaGraduationCap className="w-6 h-6" />,
		title: "Self-Paced Learning",
		description:
			"Master your subjects with flexible study schedules and personalized learning paths",
	},
	{
		icon: <BsShieldCheck className="w-6 h-6" />,
		title: "AI-Powered Proctoring",
		description:
			"Take exams with confidence using our advanced AI monitoring system",
	},
	{
		icon: <FaChartLine className="w-6 h-6" />,
		title: "Performance Insights",
		description:
			"Get detailed feedback and analytics to identify your strengths and areas for improvement",
	},
	{
		icon: <FaClock className="w-6 h-6" />,
		title: "24/7 Availability",
		description:
			"Schedule and take your exams anytime, anywhere with our round-the-clock platform",
	},
	{
		icon: <FaCode className="w-6 h-6" />,
		title: "Live Code Execution",
		description:
			"Write and test code in real-time across multiple programming languages",
	},
	{
		icon: <FaLanguage className="w-6 h-6" />,
		title: "Multi-Language Support",
		description:
			"Practice coding in Python, JavaScript, Java, C++, and many more languages",
	},
];

const supportCards = [
	{
		icon: <FaBook className="w-6 h-6" />,
		title: "Preparing for Exam",
		description:
			"Essential tips and guidelines to help you prepare effectively",
		href: "/guides/exam-prep",
		image: "/images/exam-prep.jpg",
	},
	{
		icon: <FaDesktop className="w-6 h-6" />,
		title: "Device and System Setup",
		description:
			"Step-by-step guide to configure your system for online exams",
		href: "/guides/system-setup",
		image: "/images/device-setup.jpg",
	},
	{
		icon: <FaQuestion className="w-6 h-6" />,
		title: "Troubleshoot and Tips",
		description:
			"Common issues and their solutions for a smooth exam experience",
		href: "/guides/troubleshoot",
		image: "/images/troubleshoot.jpg",
	},
	{
		icon: <FaHeadset className="w-6 h-6" />,
		title: "Getting Help and Support",
		description: "Access our support resources and contact assistance",
		href: "/support",
		image: "/images/help-support.jpg",
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
				<MenuSheet />
			</div>

			<main className="container mx-auto px-4 py-16">
				{/* Hero Section */}
				<section className="text-center max-w-4xl mx-auto space-y-6 mb-20">
					<h1
						className="text-5xl font-extrabold 
                       bg-clip-text text-transparent 
                       bg-gradient-to-r from-blue-500 to-teal-400"
					>
						Welcome to eExams
					</h1>
					<p className="text-xl text-gray-600">
						The next-generation platform for online assessments.
					</p>
					<div className="flex flex-wrap gap-4 justify-center">
						<Link href="/exams">
							<Button className="text-lg px-8 py-6">
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
				</section>

				{/* Features Grid */}
				<section className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
					{features.map((feature, index) => (
						<div
							key={index}
							className="p-6 rounded-xl 
                         bg-white/20 backdrop-blur-lg 
                         border border-white/30
                         shadow-lg hover:shadow-xl 
                         transition-all duration-300"
						>
							<div className="flex items-center gap-4 mb-4">
								<div className="p-3 rounded-lg bg-primary/10 text-primary">
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold text-gray-800">
									{feature.title}
								</h3>
							</div>
							<p className="text-gray-600">
								{feature.description}
							</p>
						</div>
					))}
				</section>

				{/* Image and Info Section */}
				<section className="flex flex-col md:flex-row items-center max-w-6xl mx-auto my-20 gap-8">
					<div className="w-full md:w-1/2 p-4">
						<Image
							src="https://img.freepik.com/free-photo/final-exam-results-test-reading-books-words-concept_53876-123721.jpg"
							alt="Online Exams"
							width={600}
							height={400}
							className="rounded-lg shadow-lg"
						/>
					</div>
					<div className="w-full md:w-1/2 p-4 text-left">
						<h2 className="text-3xl font-bold mb-4 text-gray-800">
							Experience the Future of Assessments
						</h2>
						<p className="text-gray-600">
							Our platform leverages cutting-edge technology to
							deliver a seamless and secure online testing
							experience—so you can focus on your success.
						</p>
					</div>
				</section>

				{/* Support Cards Section */}
				<section className="mt-20 mb-20">
					<h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
						Exam Support Resources
					</h2>
					<div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
						{supportCards.map((card, index) => (
							<Link href={card.href} key={index}>
								<div
									className="flex flex-col h-full p-6 rounded-xl 
                             bg-white/20 backdrop-blur-lg 
                             border border-white/30 shadow-lg 
                             hover:shadow-xl transition-all duration-300
                             cursor-pointer"
								>
									{/* Card Image */}
									{card.image && (
										<div className="relative w-full h-40 mb-4">
											<Image
												src={card.image}
												alt={card.title}
												fill
												className="object-cover rounded-lg"
											/>
										</div>
									)}

									{/* Card Icon and Title */}
									<div className="flex items-center gap-4 mb-4">
										<div className="p-3 rounded-lg bg-primary/10 text-primary">
											{card.icon}
										</div>
										<h3 className="text-xl font-semibold text-gray-800">
											{card.title}
										</h3>
									</div>

									{/* Card Description */}
									<p className="text-gray-600">
										{card.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* Final Call to Action */}
				<section className="text-center mt-20 max-w-2xl mx-auto">
					<h2 className="text-3xl font-bold mb-6 text-gray-800">
						Ready to Get Started?
					</h2>
					<p className="text-gray-600 mb-8">
						Join thousands of students who are already advancing
						their careers with eExams.
					</p>
					<Link href="/exams">
						<Button className="text-lg px-8 py-6">
							Attempt Exams →
						</Button>
					</Link>
				</section>
			</main>
		</div>
	);
}
