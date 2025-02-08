import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="min-h-screen">
			<div className="grid grid-cols-2 min-h-screen">
				{/* Left Column - Sign In */}
				<div className="flex justify-center items-center">
					<SignIn
						appearance={{
							elements: {
								formButtonPrimary:
									"bg-slate-800 hover:bg-slate-900 text-white transition-colors",
								headerTitle:
									"text-2xl font-bold text-slate-800",
								headerSubtitle: "text-slate-600",
								footerAction:
									"text-slate-600 hover:text-slate-800",
								formFieldInput:
									"border-slate-200 focus:border-slate-500 focus:ring-slate-500",
								card: "shadow-xl border border-slate-100",
								form: "gap-4",
								identityPreviewText: "text-slate-700",
								identityPreviewEditButton:
									"text-slate-800 hover:text-slate-900",
							},
							variables: {
								colorPrimary: "#1e293b",
								colorText: "#334155",
								fontSize: "16px",
								borderRadius: "0.5rem",
							},
						}}
					/>
				</div>

				{/* Right Column - eAssessment Info */}
				<div className="flex flex-col justify-center px-12 bg-white shadow-lg border border-slate-100 m-6 rounded-lg">
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
		</div>
	);
}
