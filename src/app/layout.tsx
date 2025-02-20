import { ClerkProvider, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { LoadingScreen } from "@/components/ui/loading";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
	subsets: ["latin"],
	variable: "--font-manrope",
});

export const metadata: Metadata = {
	title: "Coderschool e-Exam",
	description: "Final Assessment Platform for Coderschool Students",
	icons: {
		icon: "/favicon.png",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://csassessment.it.com",
		siteName: "Coderschool e-Exam",
		title: "Coderschool e-Exam Platform",
		description: "Final Assessment Platform for Coderschool Students",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "Coderschool e-Exam Platform",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Coderschool e-Exam Platform",
		description: "Final Assessment Platform for Coderschool Students",
		images: ["/logo.png"],
		creator: "@coderschool",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${manrope.variable} antialiased`}>
					<ClerkLoading>
						<LoadingScreen />
					</ClerkLoading>
					<ClerkLoaded>{children}</ClerkLoaded>
				</body>
			</html>
		</ClerkProvider>
	);
}
