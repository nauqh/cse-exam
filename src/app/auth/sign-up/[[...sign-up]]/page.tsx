"use client";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/ui/loading";
import { SignUp, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
	const { user } = useUser();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return <LoadingScreen />;
	}
	if (!user) {
		return (
			<div className="grid md:grid-cols-2 min-h-screen bg-gradient-to-br from-blue-500/40 via-purple-400/30 to-pink-300/30">
				<div className="flex flex-col justify-center mx-auto w-full max-w-md px-6">
					<SignUp
						appearance={{
							elements: { footer: "hidden" },
						}}
					/>
					<p className="text-center mt-4 text-sm text-slate-600">
						Already have an account?{" "}
						<Link
							href="/sign-in"
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							Sign in
						</Link>
					</p>
				</div>

				{/* eAssessment Info */}
				<div className="hidden md:flex flex-col justify-center px-12 bg-white shadow-lg border border-slate-100 m-6 rounded-lg">
					<div>
						<h1 className="text-4xl font-bold text-slate-800 mb-6">
							Online Examination Portal
						</h1>
						<p className="text-lg text-slate-600 mb-8">
							A secure and modern platform for academic
							assessments
						</p>

						<div className="space-y-6">
							<div className="border-l-4 border-blue-600 pl-4">
								<h3 className="font-semibold text-slate-800 mb-2">
									Key Features
								</h3>
								<ul className="space-y-3 text-slate-600">
									<li className="flex items-center">
										<span className="mr-2 text-blue-600">
											•
										</span>
										Secure browser environment
									</li>
									<li className="flex items-center">
										<span className="mr-2 text-blue-600">
											•
										</span>
										Auto-save functionality
									</li>
									<li className="flex items-center">
										<span className="mr-2 text-blue-600">
											•
										</span>
										24/7 technical support
									</li>
								</ul>
							</div>

							<div className="border-l-4 border-green-600 pl-4">
								<h3 className="font-semibold text-slate-800 mb-2">
									Exam Rules
								</h3>
								<ul className="space-y-3 text-slate-600">
									<li className="flex items-center">
										<span className="mr-2 text-green-600">
											•
										</span>
										Quiet examination environment required
									</li>
									<li className="flex items-center">
										<span className="mr-2 text-green-600">
											•
										</span>
										No unauthorized materials allowed
									</li>
									<li className="flex items-center">
										<span className="mr-2 text-green-600">
											•
										</span>
										Stable internet connection needed
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="mt-8 p-4 bg-blue-50 rounded-lg">
						<p className="text-sm text-blue-800">
							Need help? Visit our{" "}
							<Link
								href="https://discord.com/channels/957854915194126336/1081063200377806899"
								className="underline hover:text-blue-600"
							>
								Discord support forum
							</Link>
						</p>
					</div>
				</div>
			</div>
		);
	}
}

/*
"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function Page() {
	return (
		<div className="grid md:grid-cols-2 min-h-screen">
			{/* Sign Up Form 
			<div className="flex flex-col justify-center mx-auto w-full max-w-md px-6">
				<SignUp.Root>
					<SignUp.Step
						name="start"
						className="flex flex-col justify-center mx-auto w-full px-6 space-y-6"
					>
						<header>
							<Image
								src="/logo.png"
								alt="Coderschool Logo"
								width={200}
								height={50}
							/>
							<h1 className="text-3xl font-bold mt-6 mb-4">
								Create your account
							</h1>
							<p className="text-gray-600 mb-4">
								Join eAssessment to start your learning journey
							</p>
						</header>

						<Clerk.GlobalError className="block text-sm text-red-600" />

						<div className="space-y-4">
							<Clerk.Field name="identifier">
								<Clerk.Label className="sr-only">
									Email
								</Clerk.Label>
								<Clerk.Input
									type="email"
									required
									placeholder="Email"
									className="w-full border-b border-neutral-200 bg-white pb-2 text-sm/6 text-neutral-950 outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-600 data-[invalid]:border-red-600 data-[invalid]:text-red-600"
								/>
								<Clerk.FieldError className="mt-2 block text-xs text-red-600" />
							</Clerk.Field>

							<Clerk.Field name="password" className="space-y-2">
								<Clerk.Label className="sr-only">
									Email
								</Clerk.Label>
								<Clerk.Input
									type="password"
									required
									placeholder="Password"
									className="w-full border-b border-neutral-200 bg-white pb-2 text-sm/6 text-neutral-950 outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-600 data-[invalid]:border-red-600 data-[invalid]:text-red-600"
								/>
								<Clerk.FieldError className="mt-2 block text-xs text-red-600" />
							</Clerk.Field>
						</div>

						<SignUp.Action
							submit
							className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
						>
							Sign Up
						</SignUp.Action>

						<div className="relative flex items-center justify-center mt-6 mb-6">
							<div className="border-t border-gray-300 w-full"></div>
							<span className="bg-white text-center px-4 text-sm text-gray-500 w-full">
								Or sign up with
							</span>
							<div className="border-t border-gray-300 w-full"></div>
						</div>

						<div className="flex gap-2 justify-center">
							<Clerk.Connection
								name="google"
								className="bg-white text-gray-700 p-2 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
							>
								<FcGoogle className="w-8 h-8" />
							</Clerk.Connection>
						</div>

						<p className="text-center text-sm text-neutral-500">
							Already have an account?{" "}
							<Clerk.Link
								navigate="sign-in"
								className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
							>
								Sign in
							</Clerk.Link>
						</p>
					</SignUp.Step>

					<SignUp.Step
						name="verifications"
						className="w-full space-y-6 rounded-2xl px-4 py-10 sm:px-8"
					>
						<SignUp.Strategy name="email_code">
							<header>
								<Image
									src="/logo.png"
									alt="Coderschool Logo"
									width={200}
									height={50}
								/>
								<h1 className="text-2xl font-bold mt-6 mb-4">
									Verify your email
								</h1>
							</header>
							<Clerk.GlobalError className="block text-sm text-red-600" />
							<Clerk.Field name="code" className="space-y-2">
								<Clerk.Label className="text-sm font-medium text-zinc-950">
									Email code
								</Clerk.Label>
								<Clerk.Input
									type="otp"
									required
									className="w-full border-b border-neutral-200 bg-white pb-2 text-sm/6 text-neutral-950 outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-600 data-[invalid]:border-red-600 data-[invalid]:text-red-600"
								/>
								<Clerk.FieldError className="mt-2 block text-xs text-red-600" />
							</Clerk.Field>
							<SignUp.Action
								submit
								className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
							>
								Verify Email
							</SignUp.Action>
						</SignUp.Strategy>
					</SignUp.Step>

					<SignUp.Step
						name="continue"
						className="w-full space-y-6 rounded-2xl px-4 py-10 sm:px-8"
					>
						<header>
							<Image
								src="/logo.png"
								alt="Coderschool Logo"
								width={200}
								height={50}
							/>
							<h1 className="text-2xl font-bold mt-6 mb-4">
								Complete your profile
							</h1>
						</header>
						<Clerk.GlobalError className="block text-sm text-red-600" />
						<Clerk.Field name="username" className="space-y-2">
							<Clerk.Label className="text-sm font-medium text-zinc-950">
								Username
							</Clerk.Label>
							<Clerk.Input
								type="text"
								required
								className="w-full border-b border-neutral-200 bg-white pb-2 text-sm/6 text-neutral-950 outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-600 data-[invalid]:border-red-600 data-[invalid]:text-red-600"
							/>
							<Clerk.FieldError className="mt-2 block text-xs text-red-600" />
						</Clerk.Field>
						<SignUp.Action
							submit
							className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
						>
							Complete Sign Up
						</SignUp.Action>
					</SignUp.Step>
				</SignUp.Root>
			</div>

			<div className="hidden md:flex flex-col justify-center px-12 bg-white shadow-lg border border-slate-100 m-6 rounded-lg">
				<h1 className="text-4xl font-bold text-slate-800 mb-6">
					Join eAssessment Today
				</h1>
				<p className="text-lg text-slate-600 mb-4">
					Start your learning journey with our comprehensive online
					examination platform
				</p>
				<ul className="space-y-4 text-slate-700">
					<li className="flex items-center">
						<span className="mr-2">✓</span>
						Secure and reliable testing environment
					</li>
					<li className="flex items-center">
						<span className="mr-2">✓</span>
						Real-time results and analytics
					</li>
					<li className="flex items-center">
						<span className="mr-2">✓</span>
						Support for multiple question types
					</li>
					<li className="flex items-center">
						<span className="mr-2">✓</span>
						Automated grading system
					</li>
				</ul>
			</div>
		</div>
	);
}
*/
