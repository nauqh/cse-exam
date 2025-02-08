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
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			appearance={{
				layout: {
					unsafe_disableDevelopmentModeWarnings: true,
				},
			}}
		>
			<html lang="en">
				<body className={`${manrope.variable} antialiased`}>
					<ClerkLoading>
						<LoadingScreen></LoadingScreen>
					</ClerkLoading>
					<ClerkLoaded>{children}</ClerkLoaded>
				</body>
			</html>
		</ClerkProvider>
	);
}
