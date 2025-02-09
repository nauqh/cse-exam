"use client";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { HiArrowRight } from "react-icons/hi";
import { LoadingScreen } from "@/components/ui/loading";
import Image from "next/image";
import Link from "next/link";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

export default function Page() {
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
	return (
		<div className="grid md:grid-cols-2 min-h-screen bg-gradient-to-br from-blue-500/40 via-purple-400/30 to-pink-300/30">
			{/* Sign In */}
			<div className="flex flex-col justify-center items-center p-8">
				<div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-md bg-white/30 border border-white/30 shadow-xl">
					<SignIn.Root>
						<SignIn.Step
							name="start"
							className="flex flex-col space-y-6"
						>
							<header>
								<Image
									src="/logo.png"
									alt="Coderschool Logo"
									width={200}
									height={50}
								/>
								<h1 className="text-2xl font-bold mt-6 mb-2 text-gray-900">
									Sign in to CoderSchool
								</h1>
								<p className="text-gray-700 text-sm">
									Welcome back! Please sign in to continue.
								</p>
							</header>

							<Clerk.GlobalError className="block text-sm text-red-600" />

							<Clerk.Field name="identifier">
								<Clerk.Label className="sr-only">
									Email
								</Clerk.Label>
								<Clerk.Input
									type="email"
									required
									placeholder="Email"
									className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2focus:border-transparent data-[invalid]:border-red-500 data-[invalid]:text-red-600"
								/>
								<Clerk.FieldError className="mt-2 block text-xs text-red-600" />
							</Clerk.Field>

							<SignIn.Action
								submit
								className="w-full bg-primary backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
							>
								Continue <HiArrowRight />
							</SignIn.Action>

							<div className="flex items-center">
								<div className="flex-1 border-t border-gray-400"></div>
								<span className="mx-4 whitespace-nowrap text-sm text-gray-600">
									Or continue with
								</span>
								<div className="flex-1 border-t border-gray-400"></div>
							</div>

							<div className="flex gap-2 justify-center">
								<Clerk.Connection
									name="google"
									className="bg-white p-2 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
								>
									<FcGoogle className="w-6 h-6" />
								</Clerk.Connection>
							</div>

							<p className="text-center text-sm text-neutral-500">
								Don&apos;t have an account?{" "}
								<Clerk.Link
									navigate="sign-up"
									className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
								>
									Sign up
								</Clerk.Link>
							</p>
						</SignIn.Step>

						<SignIn.Step
							name="verifications"
							className="w-full space-y-6"
						>
							<SignIn.Strategy name="email_code">
								<header>
									<Image
										src="/logo.png"
										alt="Coderschool Logo"
										width={200}
										height={50}
									/>
									<h1 className="text-2xl font-bold mt-6 mb-4">
										Verify email code
									</h1>
								</header>
								<Clerk.GlobalError className="block text-sm text-red-600" />

								<Clerk.Field name="code">
									<Clerk.Label className="sr-only">
										Email code
									</Clerk.Label>
									<Clerk.Input
										type="otp"
										required
										placeholder="Email code"
										className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none border-neutral-200 bg-white pb-2 outline-none placeholder:text-neutral-400 data-[invalid]:border-red-500 data-[invalid]:text-red-600"
									/>
									<Clerk.FieldError className="mt-2 block text-xs text-red-600" />
								</Clerk.Field>
								<SignIn.Action
									submit
									className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
								>
									Continue
								</SignIn.Action>
							</SignIn.Strategy>

							<p className="text-center text-sm text-neutral-500">
								Don&apos;t have an account?{" "}
								<Clerk.Link
									navigate="sign-up"
									className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
								>
									Sign up
								</Clerk.Link>
							</p>
						</SignIn.Step>
					</SignIn.Root>
				</div>
			</div>

			{/* eAssessment Info */}
			<div className="hidden md:flex flex-col justify-center px-12 bg-white shadow-lg border border-slate-100 m-6 rounded-lg">
				<div>
					<h1 className="text-4xl font-bold text-slate-800 mb-6">
						Online Examination Portal
					</h1>
					<p className="text-lg text-slate-600 mb-8">
						A secure and modern platform for academic assessments
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
