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
} from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";

const features = [
	{
		icon: <FaGraduationCap className="w-6 h-6" />,
		title: "Comprehensive Learning",
		description:
			"Access a wide range of courses and assessments designed by experts",
	},
	{
		icon: <BsShieldCheck className="w-6 h-6" />,
		title: "Secure Testing",
		description:
			"Advanced proctoring and security measures to ensure test integrity",
	},
	{
		icon: <FaChartLine className="w-6 h-6" />,
		title: "Detailed Analytics",
		description:
			"Track progress and performance with comprehensive analytics",
	},
	{
		icon: <FaClock className="w-6 h-6" />,
		title: "Flexible Timing",
		description: "Take exams at your own pace, whenever you're ready",
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
		<div className="min-h-screen">
			<div className="fixed top-1 right-1 md:top-6 md:right-6 z-50">
				<MenuSheet />
			</div>

			<main className="container mx-auto px-4 py-16">
				{/* Hero Section */}
				<section className="text-center max-w-4xl mx-auto space-y-6 mb-20">
					<h1 className="text-5xl font-extrabold text-primary bg-clip-text">
						Welcome to eExams
					</h1>
					<p className="text-xl text-gray-600">
						The next generation platform for online assessments
					</p>
					<div className="flex gap-4 justify-center">
						<Link href="/exams">
							<Button className="text-lg px-8 py-6">
								Start Learning
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
								shadow-lg
								hover:shadow-xl
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

				{/* Image Section */}
				<section className="flex flex-col md:flex-row items-center max-w-6xl mx-auto my-20 gap-8">
					<div className="w-full md:w-1/2 p-4">
						<Image
							src="https://img.freepik.com/free-photo/final-exam-results-test-reading-books-words-concept_53876-123721.jpg" // Adjust this path as needed
							alt="Online Exams"
							width={600}
							height={400}
							className="rounded-lg shadow-lg"
						/>
					</div>
					<div className="w-full md:w-1/2 p-4">
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
                border border-white/30
                shadow-lg
                hover:shadow-xl
                transition-all duration-300
                cursor-pointer"
								>
									{/* Card Image */}
									{card.image && (
										<div className="relative w-full h-40 mb-4">
											<Image
												src="https://cdn.pixabay.com/photo/2020/06/01/18/47/math-5247958_640.jpg"
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

				{/* Call to Action */}
				<section className="text-center mt-20 max-w-2xl mx-auto">
					<h2 className="text-3xl font-bold mb-6 text-gray-800">
						Ready to Get Started?
					</h2>
					<p className="text-gray-600 mb-8">
						Join thousands of students who are already advancing
						their careers with eExams
					</p>
					<Link href="/exams">
						<Button className="text-lg px-8 py-6">
							Explore Courses →
						</Button>
					</Link>
				</section>
			</main>
		</div>
	);
}
