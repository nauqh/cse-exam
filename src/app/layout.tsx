import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
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
				elements: {
					footer: "hidden",
				},
			}}
		>
			<html lang="en">
				<body className={`${manrope.variable} antialiased`}>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
