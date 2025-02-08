"use client";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

export default function Page() {
	return (
		<div className="grid md:grid-cols-2 min-h-screen">
			{/* Sign In */}
			<div className="flex flex-col justify-center mx-auto w-full max-w-md px-6">
				<Image
					src="/logo.png"
					alt="Coderschool Logo"
					width={200}
					height={50}
				/>
				<h1 className="text-3xl font-bold mt-6 mb-4">
					Sign in to CoderSchool
				</h1>
				<p className="text-gray-600 mb-4">
					Welcome back! Please sign in to continue.
				</p>

				<SignIn.Root>
					<SignIn.Step name="start">
						<Clerk.Field name="identifier">
							<Clerk.Label className="text-gray-700 text-sm">
								Email
							</Clerk.Label>
							<Clerk.Input
								className="w-full p-2 border rounded-lg focus:outline-none"
								placeholder="Your email address"
							/>
							<Clerk.FieldError className="text-red-500" />
						</Clerk.Field>

						<Clerk.Field name="password" className="mt-4">
							<Clerk.Label className="text-gray-700 text-sm">
								Password
							</Clerk.Label>
							<Clerk.Input
								type="password"
								className="w-full p-2 border rounded-lg focus:outline-none"
								placeholder="Your password"
							/>
						</Clerk.Field>

						<p className="text-right text-sm  mt-2 cursor-pointer">
							Forgot password?
						</p>

						<SignIn.Action
							submit
							className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
						>
							Sign In
						</SignIn.Action>

						<div className="relative flex items-center justify-center mt-6 mb-6">
							<div className="border-t border-gray-300 w-full"></div>
							<span className="bg-white text-center px-4 text-sm text-gray-500 w-full">
								Or sign in with
							</span>
							<div className="border-t border-gray-300 w-full"></div>
						</div>

						<div className="flex gap-2 justify-center">
							<Clerk.Connection
								name="google"
								className="bg-white text-gray-700 p-2 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
							>
								<FcGoogle className="w-6 h-6" />
							</Clerk.Connection>
						</div>
					</SignIn.Step>
				</SignIn.Root>

				<p className="mt-4 text-gray-600 text-center">
					Not a member?{" "}
					<span className="text-blue-500 cursor-pointer">
						Create a free account
					</span>
				</p>
			</div>

			{/* eAssessment Info */}
			<div className="hidden md:flex flex-col justify-center px-12 bg-white shadow-lg border border-slate-100 m-6 rounded-lg">
				<h1 className="text-4xl font-bold text-slate-800 mb-6">
					Welcome to eAssessment
				</h1>
				<p className="text-lg text-slate-600 mb-4">
					Your comprehensive online examination platform
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
