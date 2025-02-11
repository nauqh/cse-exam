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
	FaUser,
	FaClipboardList,
	FaRocket,
	FaFacebook,
	FaTwitter,
	FaInstagram,
	FaLinkedin,
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
		image: "https://cdn.vysokeskoly.cz/czech-universities/uploads/2024/01/preparing_for_exams.jpg",
	},
	{
		icon: <FaDesktop className="w-6 h-6" />,
		title: "Device and System Setup",
		description:
			"Step-by-step guide to configure your system for online exams",
		href: "/guides/system-setup",
		image: "https://www.cfp.net/-/media/images/cfp-board/photos/full-width/individuals/1144287280.jpg?cx=0&cy=0&cw=750&ch=550&hash=DAF2E9DA34856A90B08DFD63C88C6A1E",
	},
	{
		icon: <FaQuestion className="w-6 h-6" />,
		title: "Troubleshoot and Tips",
		description:
			"Common issues and their solutions for a smooth exam experience",
		href: "/guides/troubleshoot",
		image: "https://mymountainmover.com/wp-content/uploads/2024/01/customer-service-virtual-assistant.jpg",
	},
	{
		icon: <FaHeadset className="w-6 h-6" />,
		title: "Getting Help and Support",
		description: "Access our support resources and contact assistance",
		href: "/support",
		image: "https://imperativeconcierge.com/wp-content/uploads/2024/05/successful-customer-service-representative-using-l-2023-11-27-04-56-13-utc-scaled.jpg",
	},
];

const steps = [
	{
		icon: <FaUser className="w-6 h-6" />,
		title: "Sign Up & Register",
		description:
			"Create your profile and register for your upcoming exams easily.",
	},
	{
		icon: <FaClipboardList className="w-6 h-6" />,
		title: "Prepare & Practice",
		description:
			"Access study materials and practice exams to build your confidence.",
	},
	{
		icon: <FaRocket className="w-6 h-6" />,
		title: "Take Exams",
		description:
			"Sit for your exams with our secure, AI-powered proctoring system.",
	},
];

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Mobile Menu */}
			<div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
				<MenuSheet />
			</div>

			<main className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 flex-grow">
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
					<div className="flex flex-wrap gap-6 justify-center">
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
				</section>

				{/* How It Works Section */}
				<section className="mt-24 mb-24">
					<h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
						How It Works
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{steps.map((step, index) => (
							<div
								key={index}
								className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100"
							>
								<div className="flex justify-center items-center mb-4">
									<div className="p-3 rounded-xl bg-[#1d283a]/10 text-[#1d283a]">
										{step.icon}
									</div>
								</div>
								<h3 className="text-lg font-bold text-gray-800 mb-2">
									{step.title}
								</h3>
								<p className="text-sm text-gray-600 leading-relaxed">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Image and Info Section */}
				<section className="flex flex-col md:flex-row items-center max-w-6xl mx-auto my-24 gap-8">
					<div className="w-full md:w-1/2">
						<Image
							src="https://img.freepik.com/free-photo/final-exam-results-test-reading-books-words-concept_53876-123721.jpg"
							alt="Online Exams"
							width={500}
							height={300}
							className="rounded-2xl shadow-2xl"
						/>
					</div>
					<div className="w-full md:w-1/2 space-y-6">
						<h2 className="text-4xl font-bold text-gray-800">
							Experience the Future of Assessments
						</h2>
						<p className="text-xl text-gray-600 leading-relaxed">
							Our platform leverages cutting-edge technology to
							deliver a seamless and secure online testing
							experience—so you can focus on your success.
						</p>
					</div>
				</section>

				{/* Exam Support Resources Section */}
				<section className="mt-24 mb-24">
					<h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
						Exam Support Resources
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{supportCards.map((card, index) => (
							<Link href={card.href} key={index}>
								<div className="group h-full p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
									{card.image && (
										<div className="relative mb-6 h-[200px] w-full overflow-hidden rounded-xl">
											<Image
												src={card.image}
												alt={card.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										</div>
									)}

									{/* Card Icon and Title */}
									<div className="flex items-center gap-4 mb-4">
										<div className="p-3 rounded-xl bg-[#1d283a]/10 text-[#1d283a]">
											{card.icon}
										</div>
										<h3 className="text-xl font-bold text-gray-800">
											{card.title}
										</h3>
									</div>

									{/* Card Description */}
									<p className="text-gray-600 leading-relaxed">
										{card.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* Final Call to Action */}
				<section className="text-center max-w-3xl mx-auto p-12 rounded-2xl">
					<h2 className="text-4xl font-bold mb-6 text-gray-800">
						Ready to Get Started?
					</h2>
					<p className="text-xl text-gray-600 mb-8">
						Join thousands of students who are already advancing
						their careers with eExams.
					</p>
					<Link href="/exams">
						<Button className="text-lg px-10 py-6 bg-[#1d283a] hover:bg-[#2a3a52]">
							Attempt Exams →
						</Button>
					</Link>
				</section>
			</main>

			<footer className="py-10 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div>
							<h3 className="text-lg font-bold text-gray-800">
								Official Exam Info
							</h3>
							<ul className="mt-4 space-y-2">
								<li>
									<Link
										href="https://www.monash.edu/students/admin/assessments/exams"
										className="hover:text-gray-800"
										target="_blank"
									>
										Monash University Exams
									</Link>
								</li>
							</ul>
						</div>

						<div className="hidden md:block"></div>

						<div>
							<h3 className="text-lg font-bold text-gray-800">
								Exam Information
							</h3>
							<ul className="mt-4 space-y-2">
								<li>
									<Link
										href="/exams/timetable"
										className="hover:text-gray-800"
									>
										Exam Timetable
									</Link>
								</li>
								<li>
									<Link
										href="/exams/policies"
										className="hover:text-gray-800"
									>
										Exam Policies
									</Link>
								</li>
								<li>
									<Link
										href="/exams/results"
										className="hover:text-gray-800"
									>
										Exam Results
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-bold text-gray-800">
								Social Media
							</h3>
							<ul className="mt-4 flex items-center space-x-4">
								<li>
									<Link
										href="https://www.facebook.com"
										target="_blank"
										className="transition transform hover:text-gray-600"
									>
										<FaFacebook className="w-6 h-6" />
									</Link>
								</li>
								<li>
									<Link
										href="https://www.twitter.com"
										target="_blank"
										className="transition transform hover:text-gray-600"
									>
										<FaTwitter className="w-6 h-6" />
									</Link>
								</li>
								<li>
									<Link
										href="https://www.instagram.com"
										target="_blank"
										className="transition transform hover:text-gray-600"
									>
										<FaInstagram className="w-6 h-6" />
									</Link>
								</li>
								<li>
									<Link
										href="https://www.linkedin.com"
										target="_blank"
										className="transition transform hover:text-gray-600"
									>
										<FaLinkedin className="w-6 h-6" />
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-10 border-t border-gray-300 pt-4">
						<div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-500">
							<div>
								Copyright © {new Date().getFullYear()} Nauqh.
							</div>
							<div className="hidden md:flex gap-4 mt-4 md:mt-0">
								<Link href="/" className="hover:text-gray-800">
									Privacy Policy
								</Link>
								<Link href="/" className="hover:text-gray-800">
									Terms of Use
								</Link>
								<Link href="/" className="hover:text-gray-800">
									Cookies
								</Link>
								<Link href="/" className="hover:text-gray-800">
									Preferences
								</Link>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
